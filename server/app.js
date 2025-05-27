import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.static(path.resolve("../client/dist/")));
app.use("/images", express.static(path.resolve("../client/public/images")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const sessionMiddleware = session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, //skal sættes til true med HTTPS
});

app.use(sessionMiddleware);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  const user = socket.request.session.user;
  console.log("A client is connected", user?.username || "Unknown");

  socket.on("new-selection", (data) => {
    if (!user) return;

    console.log(`${user.username} added a new ${data.type}`);

    io.emit("leaderboard-update", { username: user.username, ...data });
  });
  socket.on("disconnect", () => {
    console.log("A client disconnected", socket.id);
  });
});

import authRouter from "./routers/authRouter.js";
import protectedRouter from "./routers/protectedRouter.js";
import fruitsNVeggiesRouter from "./routers/fruitsNVeggiesRouter.js";
import dashboardRouter from "./routers/dashboardRouter.js";
import leaderboardRouter from "./routers/leaderboardRouter.js";

app.use("/api", authRouter);
app.use("/api/protected", 
	protectedRouter,
	fruitsNVeggiesRouter,
	dashboardRouter,
	leaderboardRouter
);


const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on: ", PORT));
