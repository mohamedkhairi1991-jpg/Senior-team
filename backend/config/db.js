import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : false
});
