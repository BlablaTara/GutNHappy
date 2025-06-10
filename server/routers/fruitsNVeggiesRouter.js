import { Router } from "express";
import pool from "../utils/db.js";
import { getWeek } from "../utils/weeks.js";

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

  const weekId = getWeek(new Date(date || Date.now()));

  // const selectionDate = date || new Date().toISOString().split("T")[0];

  const client = await pool.connect();

  try {
    await client.query("START TRANSACTION");

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
      message: "Your choices is now saved",
      data: {
        date: weekId,
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

router.get("/current-week", (req, res) => {
  try {
    const now = new Date();
    const weekId = getWeek(now);
    res.send({ success: true, weekId });
  } catch (error) {
    console.error("Error while calculating current week:", error);
    res.status(500).send({ error: true, message: "Could not determine the current week.",});
  }

});


export default router;
