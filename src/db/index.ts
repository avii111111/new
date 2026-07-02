import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.ts';

export const createPool = () => {
  return mysql.createPool({
    host: process.env.SQL_HOST || "127.0.0.1",
    user: process.env.SQL_USER || "root",
    password: process.env.SQL_PASSWORD || "",
    database: process.env.SQL_DB_NAME || "enterprise_ai",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

const pool = createPool();

export const db = drizzle(pool, { schema, mode: "default" });
