import { Router } from "express";
import pool from "../utils/db/db.js";

const router = Router();

router.get("/profile", async (req, res) => {
  try {
    const { id } = req.session.user;

    const resultDB = await pool.query(
      `SELECT userName, email FROM users WHERE id = $1`,
      [id]
    );

    if (resultDB.rows.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(resultDB.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/profile", async (req, res) => {
  try {
    const { id } = req.session.user;

    await pool.query(
      `
            DELETE FROM users WHERE id = $1`,
      [id]
    );

    req.session.destroy(() => {
      res.send({ success: true, message: "User deleted " });
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
