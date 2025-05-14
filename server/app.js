import express from 'express';
const app = express();

app.use(express.json());


import path from 'path';
app.use(express.static(path.resolve('../client/dist/')));

import dotenv from 'dotenv/config';
console.log(process.env.SESSION_KEY);


import session from 'express-session';
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //skal sættes til true med HTTPS
}));


import authRouter from './routers/authRouter.js';
app.use('/api', authRouter);

import protectedRouter from './routers/protectedRouter.js';
app.use('/api/protected', protectedRouter);

import pagesRouter from './routers/pagesRouter.js';
app.use('/api', pagesRouter)



app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve('../client/dist/index.html'));
});


const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on: ", PORT)
);