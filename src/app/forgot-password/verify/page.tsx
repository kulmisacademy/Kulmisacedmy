import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { VerifyResetForm } from "./VerifyResetForm";

export const metadata = {
  title: "Reset Password – Kulmis Academy",
  description: "Enter your code and new password.",
};

type Props = { searchParams: Promise<{ email?: string }> };

export default async function VerifyResetPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset password</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Enter the code from your email and choose a new password.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <VerifyResetForm defaultEmail={email ?? ""} />
          </div>
          <p className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
              ← Request new code
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
