/**
 * Ensure a user exists as admin (create or update by email).
 * Uses env: ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL
 *
 * Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:ensure-admin
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import * as bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env or in the command.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle(sql as any, { schema });

async function ensureAdmin() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.users)
      .set({ role: "admin", password: hashedPassword })
      .where(eq(schema.users.id, existing[0].id));
    console.log("Updated existing user to admin:", ADMIN_EMAIL);
  } else {
    await db.insert(schema.users).values({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Created admin user:", ADMIN_EMAIL);
  }
  console.log("Sign in at /admin");
}

ensureAdmin().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
