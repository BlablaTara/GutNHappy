import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'gutnuser',
  host: 'localhost',
  database: 'gutnhappy',
  password: 'password',
  port: 5432,
});

export default pool;
