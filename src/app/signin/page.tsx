import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { SignInForm } from "./SignInForm";

export const metadata = {
  title: "Sign In – Kulmis Academy",
  description: "Sign in to your Kulmis Academy account.",
};

type Props = { searchParams: Promise<{ returnTo?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { returnTo } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-gray-600">
            Sign in to access your courses and continue learning.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SignInForm returnTo={returnTo ?? ""} />
            <div className="mt-6 pt-4 border-t border-gray-100 text-center space-y-2">
              <p>
                <Link href="/forgot-password" className="text-primary-600 hover:underline text-sm font-medium">
                  Forgot password?
                </Link>
              </p>
              <p>
                <Link href={returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : "/register"} className="text-primary-600 hover:underline text-sm font-medium">
                  Don&apos;t have an account? Register
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
