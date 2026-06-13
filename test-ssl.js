import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
  ssl: false,
  connectionTimeoutMillis: 5000,
});

pool.query('SELECT NOW()').then(console.log).catch(console.error).finally(() => pool.end());
