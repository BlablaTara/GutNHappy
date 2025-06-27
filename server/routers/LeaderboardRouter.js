import { Router } from "express";
import pool from "../utils/db/db.js";

import { getWeek } from "../utils/weeks.js";

const router = Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const currentWeek = getWeek(new Date());
    const resultDB = await pool.query(
      `
            SELECT 
                u.username,
                COALESCE(f.totalFruits, 0) AS totalFruits,
                COALESCE(v.totalVeggies, 0) AS totalVeggies
            FROM users u
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT fruit_id) AS totalFruits
                FROM user_fruit_selections
                WHERE week_id = $1
                GROUP BY user_id
            ) f ON f.user_id = u.id
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT vegetable_id) AS totalVeggies
                FROM user_vegetable_selections
                WHERE week_id = $1
                GROUP BY user_id
            ) v ON v.user_id = u.id
            ORDER BY (COALESCE(f.totalFruits, 0) + COALESCE(v.totalVeggies, 0)) DESC
            `,
      [currentWeek]
    );
    res.send({ success: true, data: resultDB.rows, week: currentWeek });
  } catch {
    res
      .status(500)
      .send({ success: false, error: "Error getting leaderboard data" });
  }
});

export default router;
