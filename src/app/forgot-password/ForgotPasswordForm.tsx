"use client";

type Props = { sent?: boolean; error?: string | null };

export function ForgotPasswordForm({ sent, error }: Props) {
  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-green-700 dark:text-green-400">
          If an account exists for that email, we sent a password reset link. Check your inbox and click the link to set a new password.
        </p>
      </div>
    );
  }

  return (
    <form method="POST" action="/api/forgot-password" className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error === "required" ? "Email is required." : "Failed to send email. Please try again later."}
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Send Reset Link
      </button>
    </form>
  );
}
