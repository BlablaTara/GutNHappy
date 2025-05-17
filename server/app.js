import dotenv from "dotenv/config";
dotenv.config;

import express from "express";
const app = express();

app.use(express.json());

import path from "path";
app.use(express.static(path.resolve("../client/dist/")));
app.use("/images", express.static(path.resolve("../client/public/images")));


import session from "express-session";
app.use(
  	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, //skal sættes til true med HTTPS
	}),
);


import http from 'http';
const server = http.createServer(app)

import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
      origin: "http://localhost:8080",
      credentials: true
    }
});

app.set("io", io);

io.engine.use();

io.on("connection", (socket) => {
	console.log("A client is connected", socket.id);

	socket.on("disconnect", () => {
		console.log("A client disconnected", socket.id);
		
	});
	
});


import authRouter from "./routers/authRouter.js";
app.use("/api", authRouter);

import protectedRouter from "./routers/protectedRouter.js";
app.use("/api/protected", protectedRouter);

import fruitsNVeggiesRouter from "./routers/fruitsNVeggiesRouter.js"
app.use("/api/protected", fruitsNVeggiesRouter)

import dashboardRouter from "./routers/dashboardRouter.js"
app.use("/api/protected", dashboardRouter)

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on: ", PORT));
