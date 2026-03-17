import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password – Kulmis Academy",
  description: "Request a password reset link.",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Enter your email and we will send you a reset link.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <ForgotPasswordForm sent={sent === "1"} error={error ?? null} />
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
