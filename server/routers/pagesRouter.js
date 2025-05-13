import { Router } from 'express';
const router = Router();

router.get("/api/fruits", async (req, res) => {
    const result = await db.all("SELECT * FROM fruits;");
    res.send({ data: result });
});

router.get('/api/vegestable', async (req, res) => {
    const result = await db.all("SELECT * FROM vegestables")
    res.semd({ data: result });
});


export default router;