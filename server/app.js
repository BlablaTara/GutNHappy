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
  console.log("A client is connected", user?.email || "Unknown");

  socket.on("new-selection", (data) => {
    if (!user) return;

    console.log(`${user.name} added a new ${data.type}`);

    io.emit("leaderboard-update", { userName: user.name, ...data });
  });
  socket.on("disconnect", () => {
    console.log("A client disconnected", socket.id);
  });
});

import authRouter from "./routers/authRouter.js";
app.use("/api", authRouter);

import protectedRouter from "./routers/protectedRouter.js";
app.use("/api/protected", protectedRouter);

import fruitsNVeggiesRouter from "./routers/fruitsNVeggiesRouter.js";
app.use("/api/protected", fruitsNVeggiesRouter);

import dashboardRouter from "./routers/dashboardRouter.js";
app.use("/api/protected", dashboardRouter);

import leaderboardRouter from "./routers/leaderboardRouter.js";
app.use("/api/protected", leaderboardRouter);

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on: ", PORT));
