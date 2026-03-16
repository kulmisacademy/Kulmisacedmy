/**
 * Adds users.status column if missing. Run: npx tsx scripts/add-user-status-column.ts
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Adding users.status column if missing...");
  await sql`DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'status'
      ) THEN
        ALTER TABLE users ADD COLUMN status varchar(20) DEFAULT 'active';
        UPDATE users SET status = 'active' WHERE status IS NULL;
        ALTER TABLE users ALTER COLUMN status SET NOT NULL;
        RAISE NOTICE 'Column users.status added.';
      ELSE
        RAISE NOTICE 'Column users.status already exists.';
      END IF;
    END $$`;
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
