import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function seedBent() {
  const db = await open({
    filename: "./gutnhappy.db",
    driver: sqlite3.Database,
  });

  const userEmail = "bent@bent.dk";

  // Find frugt id'er
  const fruits = await db.all(`SELECT id, name FROM fruits WHERE name IN ('Banana', 'Kiwi')`);
  // Find grøntsags id'er
  const veggies = await db.all(`SELECT id, name FROM vegetables WHERE name IN ('Pepper', 'Broccoli')`);

  // Antal uger vi vil indsætte data for
  const numberOfWeeks = 12;

  // Dagens dato, vi bruger som reference
  const today = new Date();

  for (let i = 0; i < numberOfWeeks; i++) {
    // Beregn dato for mandag i den pågældende uge (for at gøre det ensartet)
    const weekDate = new Date(today);
    weekDate.setDate(today.getDate() - i * 7);

    // Formatér dato til yyyy-mm-dd
    const formattedDate = weekDate.toISOString().slice(0, 10);

    // Indsæt frugter for ugen
    for (const fruit of fruits) {
      try {
        await db.run(
          `INSERT OR IGNORE INTO user_fruit_selections (user_id, fruit_id, selection_date) VALUES (?, ?, ?)`,
          [userEmail, fruit.id, formattedDate]
        );
      } catch (err) {
        console.error("Error inserting fruit:", err);
      }
    }

    // Indsæt grøntsager for ugen
    for (const veg of veggies) {
      try {
        await db.run(
          `INSERT OR IGNORE INTO user_vegetable_selections (user_id, vegetable_id, selection_date) VALUES (?, ?, ?)`,
          [userEmail, veg.id, formattedDate]
        );
      } catch (err) {
        console.error("Error inserting vegetable:", err);
      }
    }
  }

  console.log(`Seeded ${numberOfWeeks} weeks of fruits and veggies for user ${userEmail}.`);

  await db.close();
}

seedBent();
