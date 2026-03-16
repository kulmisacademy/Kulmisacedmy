"use client";

import { useFormState } from "react-dom";
import { replyToSupport } from "./actions";

export function SupportReplyForm({ messageId }: { messageId: number }) {
  const [, formAction] = useFormState(replyToSupport, null);

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="messageId" value={messageId} />
      <label htmlFor={`reply-${messageId}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Reply (sends email to student)
      </label>
      <textarea
        id={`reply-${messageId}`}
        name="reply"
        required
        rows={3}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        placeholder="Type your reply..."
      />
      <button
        type="submit"
        className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Send reply
      </button>
    </form>
  );
}
