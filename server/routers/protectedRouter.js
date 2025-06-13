import { Router } from "express";

import isUserLoggedIn from "../utils/isUserLoggedIn.js";

const router = Router();

router.get("/", isUserLoggedIn, (req, res) => {
  res.send({ isLoggedIn: true, user: req.session.user });
});

export default router;
