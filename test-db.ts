import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const host = process.env.SQL_HOST;
const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
const password = process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD;
const database = process.env.SQL_DB_NAME;

console.log("Connecting with:", { host, user, database });

const pool = new Pool({
  host,
  user,
  password,
  database,
  connectionTimeoutMillis: 15000,
  // Try with ssl optionally to see if that works
});

async function test() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Success:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

test();
