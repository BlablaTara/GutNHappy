import { Router } from 'express';
import pool from '../utils/db.js';
import { getLastNumberOfWeeks } from "../utils/weeks.js";

const router = Router();

router.get("/user-selections", async (req, res) => {
  console.log("user-selection Session:", req.session);
  try {
    const userId = req.session.user?.id;
    const { date, startDate, endDate } = req.query;

    let start = startDate;
    let end = endDate;

    if (!start || !end) {
      const weekRange = getWeekDateRange(date ? new Date(date) : new Date());
      start = weekRange.startDate;
      end = weekRange.endDate;
    }

    function getWeekDateRange(date = new Date()) {
      const day = date.getDay(); // 0 = søndag, 1 = mandag
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return {
        startDate: monday.toISOString().split("T")[0],
        endDate: sunday.toISOString().split("T")[0],
      };
    }

    let fruitQuery, veggieQuery, fruitParams, veggieParams;

    if (date) {
      fruitQuery =
        `SELECT f.id, f.name, f.image_url FROM user_fruit_selections ufs
         JOIN fruits f ON ufs.fruit_id = f.id
         WHERE ufs.user_id = $1 AND ufs.selection_date = $2`;
      fruitParams = [userId, date];

      veggieQuery =
        `SELECT v.id, v.name, v.image_url FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = $1 AND uvs.selection_date = $2`;
      veggieParams = [userId, date];

    } else if (startDate && endDate) {
      fruitQuery = 
        `SELECT f.id, f.name, f.image_url, ufs.selection_date FROM user_fruit_selections ufs
        JOIN fruits f ON ufs.fruit_id = f.id
        WHERE ufs.user_id = $1 AND ufs.selection_date BETWEEN $2 AND $3`
      ;
      fruitParams = [userId, start, end];

      veggieQuery =
        `SELECT v.id, v.name, v.image_url, uvs.selection_date FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = $1 AND uvs.selection_date BETWEEN $2 AND $3`
      ;
      veggieParams = [userId, start, end];

    } else {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoStr = oneWeekAgo.toISOString().split("T")[0];
      const todayStr = new Date().toISOString().split("T")[0];

      fruitQuery = 
        `SELECT f.id, f.name, f.image_url, ufs.selection_date FROM user_fruit_selections ufs
         JOIN fruits f ON ufs.fruit_id = f.id
         WHERE ufs.user_id = $1 AND ufs.selection_date BETWEEN $2 AND $3`;
      fruitParams = [userId, weekAgoStr, todayStr]

      veggieQuery =
        `SELECT v.id, v.name, v.image_url, uvs.selection_date FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = $1 AND uvs.selection_date BETWEEN $2 AND $3`;
      veggieParams = [userId, weekAgoStr, todayStr]
    }

    const fruitSelectionsResult = await pool.query(fruitQuery, fruitParams);
    const veggieSelectionsResult = await pool.query(veggieQuery, veggieParams);

    const fruitSelections =fruitSelectionsResult.rows;
    const veggieSelections =veggieSelectionsResult.rows;

    const uniqueFruitIds = new Set(fruitSelections.map((f) => f.id));
    const uniqueVeggieIds = new Set(veggieSelections.map((v) => v.id));

    res.send({
      success: true,
      data: {
        fruits: fruitSelections,
        vegetables: veggieSelections,
        totalUniqueItems: uniqueFruitIds.size + uniqueVeggieIds.size,
        uniqueFruitCount: uniqueFruitIds.size,
        uniqueVeggieCount: uniqueVeggieIds.size,
      },
    });
  } catch (error) {
    console.error("Error finding users choice :", error);
    res
      .status(500)
      .send({
        error: true,
        message: "Sorry, an error occured, trying to get your choices.",
      });
  }
});

router.get("/user-weekly-selections", async (req, res) => {
  console.log("user-weekly-selections Session:", req.session);
  try {
    const userId = req.session.user?.id;

    console.log("weekly-selections userId: ", userId);
    
    
    const weeksToShow = getLastNumberOfWeeks(10);

    const weeklyDataMap = new Map (
      weeksToShow.map((week) => [week, { week, fruits: 0, veggies: 0}])
    );

    console.log('weeklyDataMap efter opdatering:', Array.from(weeklyDataMap.entries()));

    
    const [weeklyFruitsResult, weeklyVeggiesResult] = await Promise.all([
      pool.query(
      `
      SELECT 
        TO_CHAR(DATE_TRUNC('week', selection_date), 'IYYY-IW') AS week,
        COUNT(DISTINCT fruit_id) AS uniqueFruits
      FROM user_fruit_selections
      WHERE user_id = $1
      GROUP BY week
    `,
      [userId]
    ),
    pool.query(
      `
      SELECT 
        TO_CHAR(DATE_TRUNC('week', selection_date), 'IYYY-IW') AS week,
        COUNT(DISTINCT vegetable_id) AS uniqueVeggies
      FROM user_vegetable_selections
      WHERE user_id = $1
      GROUP BY week
    `,
      [userId]
    ),
    ]);

    for (const { week, uniquefruits } of weeklyFruitsResult.rows) {
      if (weeklyDataMap.has(week)) {
        weeklyDataMap.get(week).fruits = parseInt(uniquefruits, 10) || 0;

      }
    }

    for (const { week, uniqueveggies } of weeklyVeggiesResult.rows) {
      if (weeklyDataMap.has(week)) {
      weeklyDataMap.get(week).veggies = parseInt(uniqueveggies, 10) || 0;
      }
    }

    const weeklyData = weeksToShow.map((week) => {
      const entry = weeklyDataMap.get(week);
      return {
        ...entry,
        label: `Week ${week.split("-")[1]}`,
      };
    });

    console.log("FRUGTER fra DB:", weeklyFruitsResult.rows); //LOG
    console.log("VEGETABLER fra DB:", weeklyVeggiesResult.rows); //LOG
    console.log("weeksToShow:", weeksToShow); //LOG
    
    res.send({
      success: true,
      data: weeklyData,
    });
  } catch (error) {
    console.error("Error fetching weekly selections:", error);
    res
      .status(500)
      .send({ error: true, message: "Could not fetch weekly selections" });
  }
});

export default router;