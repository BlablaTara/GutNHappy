import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

import setupRoutes from "./utils/setup/setupRoutes.js";
import setupSockets from "./utils/setup/setupSockets.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.resolve("../client/dist/")));
app.use("/images", express.static(path.resolve("../client/public/images")));

const sessionMiddleware = session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
});

app.use(sessionMiddleware);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

setupRoutes(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

setupSockets(io);

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on: ", PORT));
