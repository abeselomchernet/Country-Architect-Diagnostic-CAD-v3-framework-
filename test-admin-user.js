import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  host: process.env.SQL_HOST,
  user: 'ai_studio_admin',
  password: process.env.SQL_ADMIN_PASSWORD,
  database: 'cloud_sql_development_database',
  connectionTimeoutMillis: 5000,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
    pool.end();
  })
})
