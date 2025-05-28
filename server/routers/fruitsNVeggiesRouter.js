import { Router } from "express";
import pool from "../utils/db.js";
import { getLastNumberOfWeeks } from "../utils/weeks.js";

const router = Router();

router.get("/fruits", async (req, res) => {
  const resultDB = await pool.query("SELECT * FROM fruits;");
  res.send({ data: resultDB.rows });
});

router.get("/vegetables", async (req, res) => {
  const resultDB = await pool.query("SELECT * FROM vegetables");
  res.send({ data: resultDB.rows });
});

router.post("/save-selections", async (req, res) => {
  const { fruitIds, veggieIds, date } = req.body;
  const userId = req.session.user?.id;
  console.log("User ID in save session:", userId);

  if (!userId) {
    return res
      .status(400)
      .send({ error: true, message: "User not authenticated" });
  }

  if (!Array.isArray(fruitIds) || !Array.isArray(veggieIds)) {
    return res
      .status(400)
      .send({ error: true, message: "Fruit og veggie id not correct" });
  }

  const selectionDate = date || new Date().toISOString().split("T")[0];

  const client = await pool.connect();

  try {
    await client.query("START TRANSACTION");

    await client.query(
      "DELETE FROM user_fruit_selections WHERE user_id = $1 AND selection_date = $2",
      [userId, selectionDate]
    );

    await client.query(
      "DELETE FROM user_vegetable_selections WHERE user_id = $1 AND selection_date = $2",
      [userId, selectionDate]
    );

    for (const fruitId of fruitIds) {
      await client.query(
        "INSERT INTO user_fruit_selections (user_id, fruit_id, selection_date) VALUES ($1, $2, $3)",
        [userId, fruitId, selectionDate]
      );
    }

    for (const veggieId of veggieIds) {
      await client.query(
        "INSERT INTO user_vegetable_selections (user_id, vegetable_id, selection_date) VALUES ($1, $2, $3)",
        [userId, veggieId, selectionDate]
      );
    }

    await client.query("COMMIT");

    res.send({
      success: true,
      message: "Your choices is now saved",
      data: {
        date: selectionDate,
        fruitCount: fruitIds.length,
        veggieCount: veggieIds.length,
        totalCount: fruitIds.length + veggieIds.length,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(
      "Could not save selection. Full error:",
      error.stack || error
    );
    res
      .status(500)
      .send({
        error: true,
        message: "An error occurred while saving your choices",
      });
  } finally {
    client.release();
  }
});

router.get("/user-selections", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { date, startDate, endDate } = req.query;

    // let fruitSelections = [];
    // let veggieSelections = [];

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
        //[userId, startDate, endDate]
      ;
      fruitParams = [userId, date, end];

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
  try {
    const userId = req.session.user?.id;
    
    const weeksToShow = getLastNumberOfWeeks(10);
    const weekSet = new Set(weeksToShow);

    const weeklyDataMap = new Map (
      weeksToShow.map((week) => [week, { week, fruits: 0, veggies: 0}])
    );
    
    const [weeklyFruitsResult, weeklyVeggiesResult] = await Promise.all([
      pool.query(
      `
      SELECT 
        TO_CHAR(selection_date, 'IYYY-IW') AS week,
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
        TO_CHAR(selection_date, 'IYYY-IW') AS week,
        COUNT(DISTINCT vegetable_id) AS uniqueVeggies
      FROM user_vegetable_selections
      WHERE user_id = $1
      GROUP BY week
    `,
      [userId]
    ),
    ]);

    for (const { week, uniqueFruits } of weeklyFruitsResult.rows) {
      if (weeklyDataMap.has(week)) {
        weeklyDataMap.get(week).fruits = parseInt(uniqueFruits, 10);
      }
    }

    for (const { week, uniqueVeggies } of weeklyVeggiesResult.rows) {
      if (weeklyDataMap.has(week)) {
        weeklyDataMap.get(week).veggies = parseInt(uniqueVeggies, 10);
      }
    }


    // const weeklyFruits = weeklyFruitsResult.rows;
    // const weeklyVeggies = weeklyVeggiesResult.rows;

    // const weeklyDataMap = new Map();

    // weeklyFruits.forEach(({ week, uniqueFruits }) => {
    //   weeklyDataMap.set(week, { week, fruits: parseInt(uniqueFruits, 10), veggies: 0 });
    // });

    // weeklyVeggies.forEach(({ week, uniqueVeggies }) => {
    //   if (weeklyDataMap.has(week)) {
    //     weeklyDataMap.get(week).veggies = parseInt(uniqueVeggies, 10);
    //   } else {
    //     weeklyDataMap.set(week, { week, fruits: 0, veggies: parseInt(uniqueVeggies, 10) });
    //   }
    // });

    const weeklyData = weeksToShow.map((week) => {
      const entry = weeklyDataMap.get(week);
      return {
        ...entry,
        label: `Week ${week.split("-")[1]}`,
      };
    });
    console.log(weeklyData);
    
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
