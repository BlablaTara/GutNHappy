import "dotenv/config";
import { Router } from "express";
import pool from "../utils/db/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { sendNewPassword } from "../utils/sendMail.js";
import { loginLimiter } from "../utils/loginAttempts.js";

const router = Router();

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  const resultDB = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  const user = resultDB.rows[0];
  if (!user) {
    return res.status(401).send({ success: false, error: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send({ success: false, error: "Wrong password" });
  }

  loginLimiter.resetKey(ip);

  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  res.send({ success: true, user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ succes: true });
});

router.post("/users/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ success: false, error: "Missing fields!" });
  }

  const resultDB = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  const getUser = resultDB.rows[0];

  if (getUser) {
    return res
      .status(400)
      .send({ success: false, error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertResult = await pool.query(
    `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id`,
    [email, username, hashedPassword]
  );

  const id = insertResult.rows[0].id;
  req.session.user = { id, email, username };

  res.status(200).send({ success: true });
});

router.post("/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).send({ success: false, error: "Email is required" });

  const resultDB = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = resultDB.rows[0];
  if (!user) {
    return res.status(400).send({ success: false, error: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const newPasswordExpires = Date.now() + 1000 * 60 * 60;

  await pool.query(
    `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
    [token, newPasswordExpires, email]
  );

  const frontURL = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontURL}/users/reset-password?token=${token}`;

  const resultEmail = await sendNewPassword(email, resetLink);

  if (!resultEmail.success) {
    res
      .status(500)
      .send({ success: false, error: "Could not send email. Try again." });
  }

  res.send({ success: true });
});

router.patch("/users/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .send({ success: false, error: "Missing token or password" });
  }

  const resultDB = await pool.query(
    `SELECT * FROM users WHERE reset_token = $1`,
    [token]
  );

  const user = resultDB.rows[0];
  if (!user || user.reset_token_expires < Date.now()) {
    return res
      .status(400)
      .send({ success: false, error: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2`,
    [hashedPassword, user.email]
  );

  res.send({ success: true });
});

export default router;
