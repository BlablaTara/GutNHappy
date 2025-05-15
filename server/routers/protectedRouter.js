import { Router } from "express";
import isUserLoggedIn from "../utils/isUserLoggedIn.js";

const router = Router();

router.get("/", isUserLoggedIn, (req, res) => {
  res.send({ data: req.session.user.name });
});

router.get("/user-status", isUserLoggedIn, (req, res) => {
  console.log("User status called. Session:", req.session);
  res.send({ isLoggedIn: true, user: req.session.user });
});

export default router;
