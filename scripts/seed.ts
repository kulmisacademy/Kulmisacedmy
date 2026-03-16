/**
 * Seed script: creates the first admin user.
 * Run after: npm run db:push
 *
 * Usage: npm run db:seed
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import * as bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@kulmis.academy";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123!";

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
// Type assertion for neon/drizzle-orm version compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle(sql as any, { schema });

async function seed() {
  console.log("Seeding admin user...");

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("Admin user already exists:", ADMIN_EMAIL);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.insert(schema.users).values({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created:");
  console.log("  Email:", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
  console.log("\nYou can sign in at /admin");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
