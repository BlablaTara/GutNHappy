import pool from "./db.js";

async function setupDB() {
  try {
    console.log("Dropping tables if they exists...");
    await pool.query(
      `DROP TABLE IF EXISTS
            user_fruit_selections,
            user_vegetable_selections,
            fruits,
            vegetables,
            users
            CASCADE;`
    );
    console.log("Tables dropped...");

    console.log("Creating tables...");
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                userName TEXT UNIQUE NOT NULL,
                password TEXT,
                reset_token TEXT,
                reset_token_expires BIGINT
            );`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS fruits (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                image_url TEXT,
                health_benefits TEXT
            );`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS vegetables (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                image_url TEXT,
                health_benefits TEXT
            );`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS user_fruit_selections (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                fruit_id INTEGER NOT NULL REFERENCES fruits(id) ON DELETE CASCADE,
                week_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, fruit_id, week_id)
            );`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS user_vegetable_selections (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                vegetable_id INTEGER NOT NULL REFERENCES vegetables(id) ON DELETE CASCADE,
                week_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, vegetable_id, week_id)
            );`
    );

    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_user_fruit_week ON user_fruit_selections(user_id, week_id);`
    );

    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_user_veggie_week ON user_vegetable_selections(user_id, week_id);`
    );
    console.log("Created tables");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

setupDB();
