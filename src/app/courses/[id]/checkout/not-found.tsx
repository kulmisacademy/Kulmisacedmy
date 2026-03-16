import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";

export default function CheckoutNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Course not found</h1>
          <p className="mt-2 text-gray-600">
            This course may have been removed or the link is incorrect. Browse our courses to find what you need.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Browse courses
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
