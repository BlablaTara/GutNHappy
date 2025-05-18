import { Router } from "express";
const router = Router();

import bcrypt from "bcrypt";
import crypto from "crypto";
import { getDB } from "../utils/db.js";
import { sendNewPassword } from "../utils/sendMAil.js";
import {
  isBlocked,
  recordLoginAttempt,
  resetAttempts,
} from "../utils/loginAttempts.js";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;

  if (isBlocked(ip)) {
    return res
      .status(429)
      .send({
        errorMessage: "You have used 3 attempts. Try again in 15 minuts.",
      });
  }
  const db = await getDB();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

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
  req.session.user = { email: user.email, name: user.name };
  res.send({ success: true });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ succes: true });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ errorMessage: "Missing fields!" });
  }

  const db = await getDB();
  const getUsers = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (getUsers) {
    return res.status(400).send({ errorMessage: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.run(`INSERT INTO users (email, name, password) VALUES (?, ?, ?)`, [
    email,
    name,
    hashedPassword,
  ]);

  req.session.user = { email, name };
  res.status(200).send({ success: true });

  console.log("New user created:", { email, name });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).send({ errorMessage: "Email is required" });

  const db = await getDB();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

  if (!user) {
    return res.status(400).send({ errorMessage: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const newPasswordExpires = Date.now() + 1000 * 60 * 60; // giver 1 time fra nu af

  await db.run(
    `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?`,
    [token, newPasswordExpires, email],
  );

  const resetLink = `http://localhost:8080/reset-password?token=${token}`;

  const result = await sendNewPassword(email, resetLink);
  if (result.success) {
    res.send({ success: true, message: "Reset email sent" });
  } else {
    res.status(500).send({ error: result.error });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).send({ errorMessage: "Missing token or password" });
  }

  const db = await getDB();
  const user = await db.get(`SELECT * FROM users WHERE reset_token = ?`, [
    token,
  ]);

  if (!user || user.reset_token_expires < Date.now()) {
    return res.status(400).send({ errorMessage: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.run(
    `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?`,
    [hashedPassword, user.email],
  );

  res.send({ success: true, message: "Password has been reset" });
});

//ekstra router, som frontend kan kontakte, og finde ud af hvad de vil gøre med
// router.get("/user-status", (req, res) => {
//   if (req.session.user) {
//     return res.status(200).json({ isLoggedIn: true, user: req.session.user });
//   } else {
//     return res.status(401).json({ isLoggedIn: false });
//   }
// });

export default router;
