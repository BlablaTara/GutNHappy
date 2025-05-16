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

export default router;
