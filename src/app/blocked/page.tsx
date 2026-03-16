import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Account restricted</h1>
          <p className="mt-2 text-gray-600">
            Your account has been deactivated. Please contact support if you believe this is an error.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Go to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
