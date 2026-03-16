"use client";

import Link from "next/link";

type Props = { token: string; error?: string | null };

const errorMessages: Record<string, string> = {
  short: "Password must be at least 8 characters.",
  nomatch: "Passwords do not match.",
  invalid: "Invalid or expired reset link.",
  expired: "This reset link has expired. Please request a new one.",
};

export function ResetPasswordForm({ token, error }: Props) {
  const message = error ? errorMessages[error] ?? "Something went wrong. Please try again." : null;

  return (
    <form method="POST" action="/api/reset-password" className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {message && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {message}
        </p>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Update Password
      </button>
    </form>
  );
}
