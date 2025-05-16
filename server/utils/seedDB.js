import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function seedDB() {
  const db = await open({
    filename: "./gutnhappy.db",
    driver: sqlite3.Database,
  });

  await db.run(`INSERT INTO fruits (name, image_url) VALUES 
        ('Banana', '/images/fruitsPic/banans.png'),
        ('Kiwi', '/images/fruitsPic/kiwis.png')
    `);

  await db.run(`INSERT INTO vegetables (name, image_url) VALUES 
        ('Pepper', '/images/veggiesPic/peppers.png'),
        ('Broccoli', '/images/veggiesPic/broccolis.png')
    `);

  console.log("DB filled up!");
  await db.close();
}

seedDB();