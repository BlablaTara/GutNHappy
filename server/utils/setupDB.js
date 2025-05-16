import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function setupDB() {
  const db = await open({
    filename: "./gutnhappy.db",
    driver: sqlite3.Database,
  });

  await db.exec(
    `CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT,
            password TEXT,
            reset_token TEXT,
            reset_token_expires INTEGER
        );`,
  );

  await db.exec(
    `CREATE TABLE IF NOT EXISTS fruits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_url TEXT
        );`,
  );

  await db.exec(
    `CREATE TABLE IF NOT EXISTS vegetables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_url TEXT
        );`,
  );

  await db.exec(
    `CREATE TABLE IF NOT EXISTS user_fruit_selections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            fruit_id INTEGER NOT NULL,
            selection_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(email) ON DELETE CASCADE,
            FOREIGN  KEY (fruit_id) REFERENCES fruits(id) ON DELETE CASCADE,
            UNIQUE(user_id, fruit_id, selection_date)
        );`
  );

  await db.exec(
    `CREATE TABLE IF NOT EXISTS user_vegetable_selections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            vegetable_id INTEGER NOT NULL,
            selection_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(email) ON DELETE CASCADE,
            FOREIGN KEY (vegetable_id) REFERENCES vegetables(id) ON DELETE CASCADE,
            UNIQUE(user_id, vegetable_id, selection_date)
        );`
  );


  //MÅSKE, MÅSKE IKKE. RÅD FRA CHAT.
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_fruit_date ON user_fruit_selections(user_id, selection_date);`
  );

  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_veggie_date ON user_vegetable_selections(user_id, selection_date);`
  );

  console.log("DB setup complete!");
  await db.close();
}

setupDB();
