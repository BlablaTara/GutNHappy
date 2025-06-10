import pool from '.db.js';

await pool.query(`DROP TABLE IF EXISTS user_fruit_selections, user_vegetable_selections, fruits, vegetables, users CASCADE;`);
console.log("Dropped all tables");

import './setupDB.js';
import './seedFruitsNVeggies.js';
