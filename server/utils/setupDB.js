import pool from './db.js';

async function setupDB() {
  try {
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
              image_url TEXT
          );`,
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS vegetables (
              id SERIAL PRIMARY KEY,
              name TEXT UNIQUE NOT NULL,
              image_url TEXT
          );`,
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS user_fruit_selections (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              fruit_id INTEGER NOT NULL REFERENCES fruits(id) ON DELETE CASCADE,
              selection_date DATE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(user_id, fruit_id, selection_date)
          );`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS user_vegetable_selections (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              vegetable_id INTEGER NOT NULL REFERENCES vegetables(id) ON DELETE CASCADE,
              selection_date DATE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(user_id, vegetable_id, selection_date)
          );`
    );


    //MÅSKE, MÅSKE IKKE. RÅD FRA CHAT.
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_user_fruit_date ON user_fruit_selections(user_id, selection_date);`
    );

    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_user_veggie_date ON user_vegetable_selections(user_id, selection_date);`
    );
    console.log('Created tables');
    
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

setupDB();
