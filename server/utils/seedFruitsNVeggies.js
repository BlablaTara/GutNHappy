import { pool } from './db.js';

async function seedDB() {
  await pool.query(
    `INSERT INTO fruits (name, image_url) VALUES 
    ('Banana', '/images/fruitsPic/bananas.png'),
    ('Kiwi', '/images/fruitsPic/kiwis.png')
    ON CONFLICT DO NOTHING;`
  );

  await pool.query(
    `INSERT INTO vegetables (name, image_url) VALUES 
    ('Pepper', '/images/veggiesPic/peppers.png'),
    ('Broccoli', '/images/veggiesPic/broccolis.png')
    ON CONFLICT DO NOTHING;`
  );

  console.log("DB filled up!");
  await pool.end();
}

seedDB();