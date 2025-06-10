import { Router } from 'express';
import pool from '../utils/db.js';
import { getLastNumberOfWeeks } from "../utils/weeks.js";
import { getWeek } from '../utils/weeks.js';

const router = Router();

router.get("/user-selections", async (req, res) => {
  console.log("user-selection Session:", req.session);
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).send({ error: true, message: "User not authenticated" });
    }

    const dateParam = req.query.date;
    const date = dateParam ? new Date(dateParam) : new Date();
    const weekId = getWeek(date); 

    const fruitQuery = `
      SELECT f.id, f.name, f.image_url
      FROM user_fruit_selections ufs
      JOIN fruits f ON ufs.fruit_id = f.id
      WHERE ufs.user_id = $1 AND ufs.week_id = $2
    `;

    const veggieQuery = `
      SELECT v.id, v.name, v.image_url
      FROM user_vegetable_selections uvs
      JOIN vegetables v ON uvs.vegetable_id = v.id
      WHERE uvs.user_id = $1 AND uvs.week_id = $2
    `;

    const [fruitSelectionsResult, veggieSelectionsResult] = await Promise.all([
      pool.query(fruitQuery, [userId, weekId]),
      pool.query(veggieQuery, [userId, weekId]),
    ]);

    const fruitSelections = fruitSelectionsResult.rows;
    const veggieSelections = veggieSelectionsResult.rows;

    const uniqueFruitIds = new Set(fruitSelections.map((f) => f.id));
    const uniqueVeggieIds = new Set(veggieSelections.map((v) => v.id));

    res.send({
      success: true,
      data: {
        weekId,
        fruits: fruitSelections,
        vegetables: veggieSelections,
        totalUniqueItems: uniqueFruitIds.size + uniqueVeggieIds.size,
        uniqueFruitCount: uniqueFruitIds.size,
        uniqueVeggieCount: uniqueVeggieIds.size,
      },
    });
  } catch (error) {
    console.error("Error finding users choice :", error);
    res.status(500).send({
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
        week_id AS week,
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
        week_id AS week,        
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