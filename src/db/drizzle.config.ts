import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST || "127.0.0.1";
const sqlDbName = process.env.SQL_DB_NAME || "enterprise_ai";
const user = process.env.SQL_USER || "root";
const password = process.env.SQL_PASSWORD || "";

console.log(`Using user: ${user} to connect to MySQL database.`);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
  },
  verbose: true,
});
