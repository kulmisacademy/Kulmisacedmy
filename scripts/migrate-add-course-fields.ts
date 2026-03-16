/**
 * Adds missing columns and payment_requests table for existing databases.
 * Run once: npm run db:migrate
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log("Running migrations...");
  await sql`CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY NOT NULL,
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    icon varchar(100),
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id integer`;
  await sql`DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'courses_category_id_fkey'
      ) THEN
        ALTER TABLE courses ADD CONSTRAINT courses_category_id_fkey
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
      END IF;
    END $$`;
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name varchar(255)`;
  await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone varchar(50)`;
  await sql`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status varchar(20) DEFAULT 'active';
        UPDATE users SET status = 'active' WHERE status IS NULL;
        ALTER TABLE users ALTER COLUMN status SET NOT NULL;
      END IF;
    END $$`;
  await sql`CREATE TABLE IF NOT EXISTS password_reset_codes (
    id serial PRIMARY KEY NOT NULL,
    email varchar(255) NOT NULL,
    code varchar(10) NOT NULL,
    expires_at timestamp NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id serial PRIMARY KEY NOT NULL,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token varchar(255) NOT NULL UNIQUE,
    expires_at timestamp NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS support_messages (
    id serial PRIMARY KEY NOT NULL,
    user_id integer REFERENCES users(id) ON DELETE SET NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    message text NOT NULL,
    admin_reply text,
    replied_at timestamp,
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS platform_settings (
    id serial PRIMARY KEY NOT NULL,
    key varchar(100) NOT NULL UNIQUE,
    value text,
    updated_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_preview boolean NOT NULL DEFAULT false`;
  await sql`CREATE TABLE IF NOT EXISTS payment_requests (
    id serial PRIMARY KEY NOT NULL,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    phone varchar(50) NOT NULL,
    note text,
    status varchar(20) NOT NULL DEFAULT 'pending',
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS lesson_resources (
    id serial PRIMARY KEY NOT NULL,
    lesson_id integer NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title varchar(500) NOT NULL,
    resource_type varchar(20) NOT NULL,
    file_url varchar(1000),
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS reviews (
    id serial PRIMARY KEY NOT NULL,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating integer NOT NULL,
    review_text text NOT NULL,
    status varchar(20) NOT NULL DEFAULT 'pending',
    created_at timestamp DEFAULT now() NOT NULL
  )`;
  // Seed example categories if none exist
  const existing = await sql`SELECT 1 FROM categories LIMIT 1`;
  if (existing.length === 0) {
    const defaults = [
      { name: "Web Development", slug: "web-development", icon: "💻" },
      { name: "Design", slug: "design", icon: "🎨" },
      { name: "Marketing", slug: "marketing", icon: "📢" },
      { name: "Data Science", slug: "data-science", icon: "📊" },
      { name: "Mobile Development", slug: "mobile-development", icon: "📱" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence", icon: "🤖" },
    ];
    for (const row of defaults) {
      await sql`INSERT INTO categories (name, slug, icon) VALUES (${row.name}, ${row.slug}, ${row.icon})`;
    }
    console.log("Seeded example categories.");
  }
  console.log("Done.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
