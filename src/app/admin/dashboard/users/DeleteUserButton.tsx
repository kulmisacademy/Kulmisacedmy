"use client";

import { deleteUser } from "./actions";

export function DeleteUserButton({ userId, userName }: { userId: number; userName: string }) {
  return (
    <form action={deleteUser} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) e.preventDefault();
        }}
        className="text-red-600 hover:underline dark:text-red-400"
      >
        Delete
      </button>
    </form>
  );
}
