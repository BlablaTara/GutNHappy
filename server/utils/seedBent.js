import { pool } from './db.js';

async function seedBent() {
  const userEmail = "bent@bent.dk";

  const userResult = await pool.query(
    `SELECT id from users WHERE email = $1`,
    [userEmail]
  );

  if (userResult.rowCount === 0) {
    console.error(`Bruger med email ${userEmail} blev ikke fundet.`);
    await pool.end();
    return;
  }

  const userId = userResult.rows[0].id;

  const fruitResults = await pool.query(`SELECT id, FROM fruits WHERE name IN ('Banana', 'Kiwi')`);
  const fruits = fruitResults.rows;

  const veggieResult = await pool.query(`SELECT id, FROM vegetables WHERE name IN ('Pepper', 'Broccoli')`);
  const veggies = veggieResult.rows;

  const numberOfWeeks = 12;
  const today = new Date();

  for (let i = 0; i < numberOfWeeks; i++) {
    const weekDate = new Date(today);
    weekDate.setDate(today.getDate() - i * 7);
    const formattedDate = weekDate.toISOString().slice(0, 10);

    for (const fruit of fruits) {
      try {
        await pool.query(
          `INSERT INTO user_fruit_selections (user_id, fruit_id, selection_date) 
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING`,
          [userId, fruit.id, formattedDate]
        );
      } catch (err) {
        console.error("Error inserting fruit:", err);
      }
    }

    for (const veg of veggies) {
      try {
        await pool.query(
          `INSERT INTO user_vegetable_selections (user_id, vegetable_id, selection_date) 
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING`,
          [userId, veg.id, formattedDate]
        );
      } catch (err) {
        console.error("Error inserting vegetable:", err);
      }
    }
  }

  console.log(`Seeded ${numberOfWeeks} weeks of fruits and veggies for user ${userEmail}.`);

  await pool.end();
}

seedBent();
