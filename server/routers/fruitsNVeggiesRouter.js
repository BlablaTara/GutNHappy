import { Router } from "express";
import { getDB } from "../utils/db.js";

const router = Router();

router.get("/fruits", async (req, res) => {
  const db = await getDB();
  const result = await db.all("SELECT * FROM fruits;");
  res.send({ data: result });
});

router.get("/vegetables", async (req, res) => {
  const db = await getDB();
  const result = await db.all("SELECT * FROM vegetables");
  res.send({ data: result });
});

router.post("/save-selections", async (req, res) => {
  const { fruitIds, veggieIds, date } = req.body;
  console.log("Received fruitIds:", fruitIds);
  console.log("Received veggieIds:", veggieIds);
  console.log("Received date:", date);

  try {
    if (!Array.isArray(fruitIds) || !Array.isArray(veggieIds)) {
      return res.status(400).send({ error: true, message: "Fruit og veggie id not correct" });
    }

    const selectionDate = date || new Date().toISOString().split('T')[0];
    const userId = req.session.user?.email;
    console.log("User ID in session:", req.session.userId);

    const db = await getDB();

    await db.run("BEGIN TRANSACTION");

    try {
      await db.run(
        "DELETE FROM user_fruit_selections WHERE user_id = ? AND selection_date = ?",
        [userId, selectionDate]
      );

      await db.run(
        "DELETE FROM user_vegetable_selections WHERE user_id = ? AND selection_date = ?",
        [userId, selectionDate]
      );

      for (const fruitId of fruitIds) {
        await db.run(
          "INSERT INTO user_fruit_selections (user_id, fruit_id, selection_date) VALUES (?, ?, ?)",
          [userId, fruitId, selectionDate]
        );
      }

      for (const veggieId of veggieIds) {
        await db.run(
          "INSERT INTO user_vegetable_selections (user_id, vegetable_id, selection_date) VALUES (?, ?, ?)",
          [userId, veggieId, selectionDate]
        );
      }

      await db.run("COMMIT");

      res.send({
        success: true,
        message: "Your choices is now saved",
        data: {
          date: selectionDate,
          fruitCount: fruitIds.length,
          veggieCount: veggieIds.length,
          totalCount: fruitIds.length + veggieIds.length
        }
      });

    } catch (error) {
  
      await db.run("ROLLBACK");
      console.error("Could not save selection. Full error:", error.stack || error);
      res.status(500).send({ error: true, message: "An error occurred while saving your choices" });
    }

  } catch (error) {
    console.error("Could not save selection. Full error:", error.stack || error);
    res.status(500).send({ error: true, message: "An error occurred while saving your choices" });
  }
});


router.get("/user-selections", async (req, res) => {
  try {
    const userId = req.session.user?.email;
    console.log("User ID in session:", req.session.userId);
    const { date, startDate, endDate } = req.query;

    const db = await getDB();
    let fruitSelections = [];
    let veggieSelections = [];


    if (date) {
      fruitSelections = await db.all(
        `SELECT f.id, f.name, f.image_url FROM user_fruit_selections ufs
         JOIN fruits f ON ufs.fruit_id = f.id
         WHERE ufs.user_id = ? AND ufs.selection_date = ?`,
        [userId, date]
      );

      veggieSelections = await db.all(
        `SELECT v.id, v.name, v.image_url FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = ? AND uvs.selection_date = ?`,
        [userId, date]
      );
    }

    else if (startDate && endDate) {
      fruitSelections = await db.all(
        `SELECT f.id, f.name, f.image_url, ufs.selection_date FROM user_fruit_selections ufs
         JOIN fruits f ON ufs.fruit_id = f.id
         WHERE ufs.user_id = ? AND ufs.selection_date BETWEEN ? AND ?`,
        [userId, startDate, endDate]
      );

      veggieSelections = await db.all(
        `SELECT v.id, v.name, v.image_url, uvs.selection_date FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = ? AND uvs.selection_date BETWEEN ? AND ?`,
        [userId, startDate, endDate]
      );
    }

    else {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoStr = oneWeekAgo.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      fruitSelections = await db.all(
        `SELECT f.id, f.name, f.image_url, ufs.selection_date FROM user_fruit_selections ufs
         JOIN fruits f ON ufs.fruit_id = f.id
         WHERE ufs.user_id = ? AND ufs.selection_date BETWEEN ? AND ?`,
        [userId, weekAgoStr, todayStr]
      );

      veggieSelections = await db.all(
        `SELECT v.id, v.name, v.image_url, uvs.selection_date FROM user_vegetable_selections uvs
         JOIN vegetables v ON uvs.vegetable_id = v.id
         WHERE uvs.user_id = ? AND uvs.selection_date BETWEEN ? AND ?`,
        [userId, weekAgoStr, todayStr]
      );
    }

    res.send({
      success: true,
      data: {
        fruits: fruitSelections,
        vegetables: veggieSelections,
        totalUniqueItems: new Set([
          ...fruitSelections.map(f => f.id),
          ...veggieSelections.map(v => v.id)
        ]).size
      }
    });

  } catch (error) {
    console.error("Error finding users choice :", error);
    res.status(500).send({ error: true, message: "Sorry, an error occured, trying to get your choices." });
  }
});

export default router;
