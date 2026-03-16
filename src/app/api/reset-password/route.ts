import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/schema";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString()?.trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  const base = new URL(request.url).origin;
  const redirect = (params: string) => NextResponse.redirect(`${base}/reset-password${params}`, 302);

  if (!token) return redirect("?error=invalid");
  if (!password || password.length < 8) return redirect(`?token=${encodeURIComponent(token)}&error=short`);
  if (password !== confirmPassword) return redirect(`?token=${encodeURIComponent(token)}&error=nomatch`);

  const now = new Date();
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!row) return redirect("?error=invalid");
  if (new Date(row.expiresAt) < now) {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, row.id));
    return redirect("?error=expired");
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.update(users).set({ password: hashed }).where(eq(users.id, row.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, row.id));

  return redirect("?success=1");
}
