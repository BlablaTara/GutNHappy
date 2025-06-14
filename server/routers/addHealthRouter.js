import { Router } from "express";
import pool from "../utils/db/db.js";

import { getWeek } from "../utils/weeks.js";

const router = Router();

router.get("/fruits", async (req, res) => {
  const resultFruits = await pool.query("SELECT * FROM fruits;");
  res.send({ data: resultFruits.rows });
});

router.get("/vegetables", async (req, res) => {
  const resultVeggies = await pool.query("SELECT * FROM vegetables");
  res.send({ data: resultVeggies.rows });
});

router.post("/save-selections", async (req, res) => {
  const { fruitIds, veggieIds, date } = req.body;
  const userId = req.session.user?.id;
  const weekId = date || getWeek(new Date());


  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM user_fruit_selections WHERE user_id = $1 AND week_id = $2",
      [userId, weekId]
    );

    await client.query(
      "DELETE FROM user_vegetable_selections WHERE user_id = $1 AND week_id = $2",
      [userId, weekId]
    );

    for (const fruitId of fruitIds) {
      await client.query(
        "INSERT INTO user_fruit_selections (user_id, fruit_id, week_id) VALUES ($1, $2, $3)",
        [userId, fruitId, weekId]
      );
    }

    for (const veggieId of veggieIds) {
      await client.query(
        "INSERT INTO user_vegetable_selections (user_id, vegetable_id, week_id) VALUES ($1, $2, $3)",
        [userId, veggieId, weekId]
      );
    }

    await client.query("COMMIT");

    res.send({
      success: true,
      data: {
        date: weekId,
        fruitCount: fruitIds.length,
        veggieCount: veggieIds.length,
        totalCount: fruitIds.length + veggieIds.length,
      },
    });
  } catch {
    await client.query("ROLLBACK");
    res.status(500).send({ success: false });
  } finally {
    client.release();
  }
});

export default router;
