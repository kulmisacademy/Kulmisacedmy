import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { supportMessages } from "@/lib/schema";
import { SupportReplyForm } from "./SupportReplyForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSupportPage() {
  const messages = await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        View and reply to student support messages.
      </p>

      {messages.length === 0 ? (
        <p className="mt-6 text-gray-500 dark:text-gray-400">No support messages yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">{msg.name}</span>
                <span>{msg.email}</span>
                <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{msg.message}</p>
              {msg.adminReply ? (
                <div className="mt-4 rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
                  <p className="text-xs font-medium text-primary-700 dark:text-primary-300">Your reply (sent by email)</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{msg.adminReply}</p>
                  {msg.repliedAt && (
                    <p className="mt-1 text-xs text-gray-500">{new Date(msg.repliedAt).toLocaleString()}</p>
                  )}
                </div>
              ) : (
                <SupportReplyForm messageId={msg.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
