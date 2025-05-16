import { Router } from 'express';
import { getDB } from '../utils/db.js';

const router = Router();

router.get("/dashboard", async (req, res) => {
    const userId = req.session.user?.email;

    const db = await getDB();
    try {
        const result = await db.all(
        `
        SELECT week, type, count FROM (
            SELECT 
                strftime('%Y-%W', selection_date) AS week,
                'fruit' AS type,
                COUNT(*) AS count
            FROM user_fruit_selections
            WHERE user_id = ? AND selection_date >= date('now', '-3 months')
            GROUP BY week

            UNION ALL

            SELECT 
                strftime('%Y-%W', selection_date) AS week,
                'vegetable' AS type,
                COUNT(*) AS count
            FROM user_vegetable_selections
            WHERE user_id = ? AND selection_date >= date('now', '-3 months')
            GROUP BY week
        )
        ORDER BY week;
        `,
            [userId, userId]
        );

        res.send({ success: true, data: { array: result } });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send({ error: true, message: "Error fetching dashboard data" });
    }
});

export default router;