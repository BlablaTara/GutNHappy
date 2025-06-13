import pool from "./db.js";
import { getISOWeek, getYear, subWeeks } from "date-fns";

const users = [
  { id: 1, name: "MissTerror" },
  { id: 2, name: "LoneKone" },
  { id: 3, name: "Magic4ever" },
];

const fruitIds = [1, 2, 3, 4, 5, 6];
const vegetableIds = [1, 2, 3, 4, 5, 6];

function getWeekId(date) {
  const year = getYear(date);
  const week = getISOWeek(date);
  return `${year}-${week.toString().padStart(2, "0")}`;
}

function getRandomSubset(arr, maxItems = 6) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * maxItems) + 1);
}

async function seedWeeklyData() {
  try {
    console.log("Seeding data for last 10 weeks...");

    for (let i = 1; i <= 10; i++) {
      const date = subWeeks(new Date(), i);
      const week_id = getWeekId(date);

      for (const user of users) {
        const chosenFruits = getRandomSubset(fruitIds);
        const chosenVeggies = getRandomSubset(vegetableIds);

        for (const fruit_id of chosenFruits) {
          await pool.query(
            `INSERT INTO user_fruit_selections (user_id, fruit_id, week_id)
             VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING;`,
            [user.id, fruit_id, week_id]
          );
        }

        for (const vegetable_id of chosenVeggies) {
          await pool.query(
            `INSERT INTO user_vegetable_selections (user_id, vegetable_id, week_id)
             VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING;`,
            [user.id, vegetable_id, week_id]
          );
        }

        console.log(`Seeded ${user.name} for week ${week_id}`);
      }
    }

    console.log("Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedWeeklyData();
