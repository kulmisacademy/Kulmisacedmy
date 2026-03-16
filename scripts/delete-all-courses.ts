/**
 * Delete all courses (and cascade: lessons, enrollments, payment_requests, reviews, course_resources, etc.).
 * Run once to start fresh. Requires DATABASE_URL in .env.
 *
 * Usage: npm run db:delete-all-courses
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle(sql as any, { schema });

async function deleteAllCourses() {
  const list = await db.select({ id: schema.courses.id }).from(schema.courses);
  if (list.length === 0) {
    console.log("No courses to delete.");
    return;
  }
  await db.delete(schema.courses);
  console.log(`Deleted ${list.length} course(s). All related lessons, enrollments, and data were removed.`);
}

deleteAllCourses().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
