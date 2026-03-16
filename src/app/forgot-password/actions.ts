"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/schema";
import { sendMail } from "@/lib/email";
import { randomUUID } from "crypto";

const TOKEN_EXPIRY_HOURS = 1;

function getBaseUrl(): string {
  const url = process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? "https://kulmis.academy";
  return url.replace(/\/$/, "");
}

export type RequestResetState = { error?: string; success?: boolean } | null;

export async function sendResetLink(_prev: RequestResetState, formData: FormData): Promise<RequestResetState> {
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  if (!email) return { error: "Email is required." };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return { success: true };
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
  await db.insert(passwordResetTokens).values({ userId: user.id, token, expiresAt });

  const resetUrl = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  const subject = "Reset Your Kulmis Academy Password";
  const text = `You requested to reset your password.\n\nClick the link below to create a new password:\n\n${resetUrl}\n\nIf you did not request this change, you can ignore this email.`;
  const html = `
    <p>You requested to reset your password.</p>
    <p>Click the link below to create a new password:</p>
    <p><a href="${resetUrl}">Reset password</a></p>
    <p>If you did not request this change, you can ignore this email.</p>
  `;

  const sent = await sendMail({ to: email, subject, text, html });
  if (!sent) return { error: "Failed to send email. Please try again later." };
  return { success: true };
}
