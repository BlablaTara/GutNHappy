import authRouter from "../../routers/authRouter.js";
import protectedRouter from "../../routers/protectedRouter.js";
import addHealthRouter from "../../routers/addHealtRouter.js";
import dashboardRouter from "../../routers/dashboardRouter.js";
import leaderboardRouter from "../../routers/leaderboardRouter.js";
import profileRouter from "../../routers/profileRouter.js";

export default function setupRoutes(app) {
  app.use("/api", authRouter);

  app.use(
    "/api/protected",
    protectedRouter,
    addHealthRouter,
    dashboardRouter,
    leaderboardRouter,
    profileRouter
  );
}
