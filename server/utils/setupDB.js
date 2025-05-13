import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function setupDB() {
    const db = await open({
        filename: './gutnhappy.db',
        driver: sqlite3.Database
    });

    await db.exec(
        `CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT,
            password TEXT,
            reset_token TEXT,
            reset_token_expires INTEGER
        )`
    );

    console.log("User table created!");
    await db.close();
}

setupDB();