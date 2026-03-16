import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/schema";
import { sendMail } from "@/lib/email";
import { randomUUID } from "crypto";

const TOKEN_EXPIRY_HOURS = 1;

function getBaseUrl(request: Request): string {
  const url = process.env.SITE_URL ?? process.env.NEXTAUTH_URL;
  if (url) return url.replace(/\/$/, "");
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const base = getBaseUrl(request);

  if (!email) {
    return NextResponse.redirect(`${base}/forgot-password?error=required`, 302);
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return NextResponse.redirect(`${base}/forgot-password?sent=1`, 302);
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
  await db.insert(passwordResetTokens).values({ userId: user.id, token, expiresAt });

  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = "Reset Your Kulmis Academy Password";
  const text = `You requested to reset your password.\n\nClick the link below to create a new password:\n\n${resetUrl}\n\nIf you did not request this change, you can ignore this email.`;
  const html = `<p>You requested to reset your password.</p><p>Click the link below to create a new password:</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this change, you can ignore this email.</p>`;

  const sent = await sendMail({ to: email, subject, text, html });
  if (!sent) {
    return NextResponse.redirect(`${base}/forgot-password?error=failed`, 302);
  }

  return NextResponse.redirect(`${base}/forgot-password?sent=1`, 302);
}
