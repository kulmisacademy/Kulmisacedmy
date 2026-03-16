import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const _sql = connectionString ? neon(connectionString) : null;
// Type assertion for @neondatabase/serverless and drizzle-orm version compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _db = _sql ? drizzle(_sql as any, { schema }) : null;

const noDbError = new Error(
  "DATABASE_URL is not set. Add it to your .env file. Get it from https://console.neon.tech"
);

// Export db that throws only when used if DATABASE_URL is missing (so app can load)
type DbClient = NonNullable<typeof _db>;
type SqlClient = NonNullable<typeof _sql>;

export const db: DbClient =
  _db ??
  (new Proxy({} as DbClient, {
    get() {
      throw noDbError;
    },
  }) as DbClient);

export const sql: SqlClient =
  _sql ??
  (new Proxy({} as SqlClient, {
    get() {
      throw noDbError;
    },
  }) as SqlClient);
