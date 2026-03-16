import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const _sql = connectionString ? neon(connectionString) : null;
const _db = _sql ? drizzle(_sql, { schema }) : null;

const noDbError = new Error(
  "DATABASE_URL is not set. Add it to your .env file. Get it from https://console.neon.tech"
);

// Export db that throws only when used if DATABASE_URL is missing (so app can load)
export const db = _db ?? (new Proxy({} as typeof _db, {
  get() {
    throw noDbError;
  },
}) as NonNullable<typeof _db>);

export const sql = _sql ?? (new Proxy({} as typeof _sql, {
  get() {
    throw noDbError;
  },
}) as NonNullable<typeof _sql>);
