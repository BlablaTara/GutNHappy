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
        );`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS fruits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_url TEXT
        );`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS vegetables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_url TEXT
        );`
    );

    await db.run(`INSERT INTO fruits (name, image_url) VALUES 
        ('Banana', '/images/fruitsPic/banans.png'),
        ('Kiwi', '/images/fruitsPic/kiwis.png')
    `);

    await db.run(`INSERT INTO vegetables (name, image_url) VALUES 
        ('Pepper', '/images/veggiesPic/peppers.png'),
        ('Broccoli', '/images/veggiesPic/broccolis.png')
    `);

    console.log("DB setup complete!");
    await db.close();
}

setupDB();