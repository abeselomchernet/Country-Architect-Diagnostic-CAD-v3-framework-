import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = postgres({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
  ssl: false,
});

async function main() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Success:", result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
main();
