"use client";

import { useFormState } from "react-dom";
import { updateUserStatus } from "./actions";

type Status = "active" | "pending" | "blocked";

export function UserStatusSelect({ userId, currentStatus }: { userId: number; currentStatus: string }) {
  const [, formAction] = useFormState(updateUserStatus, null);
  const value = (currentStatus === "active" || currentStatus === "pending" || currentStatus === "blocked" ? currentStatus : "active") as Status;

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="status"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50"
      >
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="blocked">Blocked</option>
      </select>
    </form>
  );
}
