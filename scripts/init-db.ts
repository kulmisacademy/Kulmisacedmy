/**
 * Creates all tables in Neon (run this if drizzle-kit push fails).
 * Usage: npm run db:init
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function init() {
  console.log("Creating tables in Neon...");

  await sql`CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "phone" varchar(50),
    "password" varchar(255) NOT NULL,
    "role" varchar(20) NOT NULL DEFAULT 'student',
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone varchar(50)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status varchar(20) NOT NULL DEFAULT 'active'`;
  await sql`CREATE TABLE IF NOT EXISTS "password_reset_codes" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar(255) NOT NULL,
    "code" varchar(10) NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token" varchar(255) NOT NULL UNIQUE,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "support_messages" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "admin_reply" text,
    "replied_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "platform_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar(100) NOT NULL UNIQUE,
    "value" text,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "icon" varchar(100),
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "courses" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar(500) NOT NULL,
    "description" text,
    "thumbnail" varchar(500),
    "price" integer DEFAULT 0,
    "instructor_name" varchar(255),
    "learning_outcomes" text,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  // Add new columns if table already existed without them (e.g. from an older init)
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name varchar(255)`;
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes text`;
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id integer REFERENCES categories(id) ON DELETE SET NULL`;
  await sql`CREATE TABLE IF NOT EXISTS "lessons" (
    "id" serial PRIMARY KEY NOT NULL,
    "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "title" varchar(500) NOT NULL,
    "description" text,
    "video_url" varchar(500),
    "lesson_order" integer NOT NULL DEFAULT 0,
    "duration" integer,
    "is_preview" boolean NOT NULL DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_preview boolean NOT NULL DEFAULT false`;
  await sql`CREATE TABLE IF NOT EXISTS "payment_requests" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "name" varchar(255) NOT NULL,
    "phone" varchar(50) NOT NULL,
    "note" text,
    "status" varchar(20) NOT NULL DEFAULT 'pending',
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "enrolled_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "progress" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "completed" boolean NOT NULL DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "lesson_resources" (
    "id" serial PRIMARY KEY NOT NULL,
    "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "title" varchar(500) NOT NULL,
    "resource_type" varchar(20) NOT NULL,
    "file_url" varchar(1000),
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "rating" integer NOT NULL,
    "review_text" text NOT NULL,
    "status" varchar(20) NOT NULL DEFAULT 'pending',
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;

  console.log("Done. Tables: users, categories, courses, lessons, payment_requests, enrollments, progress, lesson_resources, reviews.");
}

init().catch((err) => {
  console.error("Init failed:", err);
  process.exit(1);
});
