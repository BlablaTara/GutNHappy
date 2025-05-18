import { Router } from 'express';
import { getDB } from '../utils/db.js';

const router = Router();

router.get("/leaderboard", async (req, res) => {

    const db = await getDB();
    try {
        const result = await db.all( 
           `
            SELECT 
                u.name,
                u.email,
                COALESCE(f.totalFruits, 0) AS totalFruits,
                COALESCE(v.totalVeggies, 0) AS totalVeggies
            FROM users u
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT fruit_id) AS totalFruits
                FROM user_fruit_selections
                WHERE selection_date >= date('now', 'weekday 0', '-7 days')
                GROUP BY user_id
            ) f ON f.user_id = u.email
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT vegetable_id) AS totalVeggies
                FROM user_vegetable_selections
                WHERE selection_date >= date('now', 'weekday 0', '-7 days')
                GROUP BY user_id
            ) v ON v.user_id = u.email
            ORDER BY (totalFruits + totalVeggies) DESC
            `
        );

        res.send({ success: true, data: result });
    } catch (error) {
        console.error("Error getting leaderbord data", error);
        res.status(500).send({ error: true, message: "Error getting leaderboard data"})
    }
});

export default router;