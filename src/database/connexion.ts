import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const connexion = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "pokemon"
});