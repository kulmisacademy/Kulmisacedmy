"use server";

import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/schema";

export type UpdatePasswordState = { error?: string; success?: boolean } | null;

export async function updatePasswordWithToken(
  _prev: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const token = formData.get("token")?.toString()?.trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!token) return { error: "Invalid or expired reset link." };
  if (!password || password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const now = new Date();
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!row) return { error: "Invalid or expired reset link." };
  if (new Date(row.expiresAt) < now) {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, row.id));
    return { error: "This reset link has expired. Please request a new one." };
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.update(users).set({ password: hashed }).where(eq(users.id, row.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, row.id));

  return { success: true };
}
