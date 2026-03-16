"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { supportMessages } from "@/lib/schema";
import { sendMail } from "@/lib/email";

export type ReplyState = { error?: string; success?: boolean } | null;

export async function replyToSupport(_prev: ReplyState, formData: FormData): Promise<ReplyState> {
  const idRaw = formData.get("messageId")?.toString();
  const reply = formData.get("reply")?.toString()?.trim();
  const messageId = idRaw ? parseInt(idRaw, 10) : null;
  if (messageId == null || isNaN(messageId) || !reply) return { error: "Missing message or reply." };

  const [msg] = await db.select().from(supportMessages).where(eq(supportMessages.id, messageId)).limit(1);
  if (!msg) return { error: "Message not found." };

  await db
    .update(supportMessages)
    .set({ adminReply: reply, repliedAt: new Date() })
    .where(eq(supportMessages.id, messageId));

  await sendMail({
    to: msg.email,
    subject: "Re: Your support request – Kulmis Academy",
    text: reply,
    html: `<p>${reply.replace(/\n/g, "<br>")}</p>`,
  });
  revalidatePath("/admin/dashboard/support");
  return { success: true };
}
