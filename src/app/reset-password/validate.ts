import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens } from "@/lib/schema";

export async function validateResetToken(token: string): Promise<boolean> {
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  if (!row) return false;
  return new Date(row.expiresAt) >= new Date();
}
