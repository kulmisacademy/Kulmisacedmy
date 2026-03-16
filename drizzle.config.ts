import { defineConfig } from "drizzle-kit";

const config = {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
};
export default defineConfig(config as Parameters<typeof defineConfig>[0]);
