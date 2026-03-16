import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Register – Kulmis Academy",
  description: "Create your student account.",
};

type Props = { searchParams: Promise<{ returnTo?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { returnTo } = await searchParams;
  const returnToEncoded = returnTo ? encodeURIComponent(returnTo) : "";

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-600">Register to enroll in courses.</p>
          <RegisterForm returnTo={returnTo ?? ""} returnToEncoded={returnToEncoded} />
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href={returnTo ? `/signin?returnTo=${returnToEncoded}` : "/signin"}
              className="text-primary-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
          <p className="mt-4 text-center">
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
