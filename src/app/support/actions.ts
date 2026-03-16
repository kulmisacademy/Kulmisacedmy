"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { supportMessages } from "@/lib/schema";

export type SupportState = { error?: string; success?: boolean } | null;

export async function submitSupportMessage(_prev: SupportState, formData: FormData): Promise<SupportState> {
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const message = formData.get("message")?.toString()?.trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  const session = await getSession();

  await db.insert(supportMessages).values({
    userId: session?.userId ?? null,
    name,
    email,
    message,
  });

  return { success: true };
}
