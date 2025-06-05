import { Router } from "express";
import pool from "../utils/db.js";

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


export default router;
