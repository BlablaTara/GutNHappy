import { Router } from "express";
const router = Router();

import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../utils/db/db.js";
import { sendNewPassword } from "../utils/sendMAil.js";
import {
  isBlocked,
  recordLoginAttempt,
  resetAttempts,
} from "../utils/loginAttempts.js";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  if (isBlocked(ip)) {
    return res.status(429).send({
      errorMessage: "You have used 3 attempts. Try again in 15 minuts.",
    });
  }
  const resultDB = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const user = resultDB.rows[0];

  if (!user) {
    recordLoginAttempt(ip);
    return res.status(401).send({ errorMessage: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    recordLoginAttempt(ip);
    return res.status(401).send({ errorMessage: "Wrong password" });
  }

  resetAttempts(ip);
  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  res.send({ success: true });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ succes: true });
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ errorMessage: "Missing fields!" });
  }

  const resultDB = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const getUsers = resultDB.rows[0];

  if (getUsers) {
    return res.status(400).send({ errorMessage: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const resultInsert = await pool.query(
    `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id`,
    [email, username, hashedPassword]
  );

  const id = resultInsert.rows[0].id;

  req.session.user = { id, email, username };
  res.status(200).send({ success: true });

  console.log("New user created:", { id, email, username });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).send({ errorMessage: "Email is required" });

  const resultDB = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  const user = resultDB.rows[0];

  if (!user) {
    return res.status(400).send({ errorMessage: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const newPasswordExpires = Date.now() + 1000 * 60 * 60; // giver 1 time fra nu af

  await pool.query(
    `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
    [token, newPasswordExpires, email]
  );

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const resultEmail = await sendNewPassword(email, resetLink);
  if (resultEmail.success) {
    res.send({ success: true, message: "Reset email sent" });
  } else {
    res.status(500).send({ error: resultEmail.error });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).send({ errorMessage: "Missing token or password" });
  }

  const resultDB = await pool.query(
    `SELECT * FROM users WHERE reset_token = $1`,
    [token]
  );
  const user = resultDB.rows[0];

  if (!user || user.reset_token_expires < Date.now()) {
    return res.status(400).send({ errorMessage: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2`,
    [hashedPassword, user.email]
  );

  res.send({ success: true, message: "Password has been reset" });
});

export default router;
