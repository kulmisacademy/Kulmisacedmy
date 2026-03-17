import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import Link from "next/link";
import { RegisterForm } from "../register/RegisterForm";

export const metadata = {
  title: "Join for Free – Kulmis Academy",
  description: "Create your free account and start learning future skills.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function JoinPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Join for free</h1>
          <p className="mt-1 text-gray-600">
            Create your account and get access to all courses.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <RegisterForm returnTo="/" returnToEncoded="" />
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary-600 hover:underline font-medium">
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
