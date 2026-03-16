import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { validateResetToken } from "./validate";

export const metadata = {
  title: "Reset Password – Kulmis Academy",
  description: "Create a new password.",
};

type Props = { searchParams: Promise<{ token?: string; success?: string; error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, success, error } = await searchParams;

  if (success === "1") {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderWithSession />
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-4">
              <p className="text-green-700 dark:text-green-400">
                Your password has been successfully updated.
              </p>
              <Link
                href="/signin"
                className="block w-full rounded-lg bg-primary-600 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!token?.trim()) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderWithSession />
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid link</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              This password reset link is invalid or missing. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              Request reset link
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const valid = await validateResetToken(token.trim());
  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderWithSession />
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Link expired or invalid</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              This password reset link has expired or is invalid. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              Request reset link
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create new password</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Enter your new password below.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <ResetPasswordForm token={token} error={error ?? null} />
          </div>
          <p className="mt-6 text-center">
            <Link href="/signin" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
