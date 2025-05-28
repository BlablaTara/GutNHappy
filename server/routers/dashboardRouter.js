import { Router } from 'express';
import pool from '../utils/db.js';

const router = Router();

router.get("/dashboard", async (req, res) => {
    console.log(" dashboard Session:", req.session);
    const userId = req.session.user?.id;

    try {
        const resultDB = await pool.query(
        `
        SELECT week, type, count FROM (
            SELECT 
                TO_CHAR(DATE_TRUNC('week', selection_date), 'IYYY-IW') AS week,
                'fruit' AS type,
                COUNT(*) AS count
            FROM user_fruit_selections
            WHERE user_id = $1 AND selection_date >= CURRENT_DATE -INTERVAL '10 weeks'
            GROUP BY week

            UNION ALL

            SELECT 
                TO_CHAR(DATE_TRUNC('week', selection_date), 'IYYY-IW') AS week,
                'vegetable' AS type,
                COUNT(*) AS count
            FROM user_vegetable_selections
            WHERE user_id = $1 AND selection_date >= CURRENT_DATE - INTERVAL '10 weeks'
            GROUP BY week
        ) AS combined
        ORDER BY week;
        `,
            [userId]
        );

        res.send({ success: true, data: resultDB.rows });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send({ error: true, message: "Error fetching dashboard data" });
    }
});

export default router;