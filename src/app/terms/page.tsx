import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service – Kulmis Academy",
  description: "Terms of service for Kulmis Academy e-learning platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-primary-600 hover:underline">
            ← Back to home
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>
          <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Acceptance of terms
              </h2>
              <p>
                By using Kulmis Academy you agree to these terms. If you do not agree, please
                do not use the platform.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Use of the service
              </h2>
              <p>
                You may use the platform for personal learning. You may not share your account,
                redistribute course materials without permission, or use the service for any
                illegal purpose.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payments and refunds
              </h2>
              <p>
                Paid course access is granted after payment confirmation and admin approval.
                Refund and cancellation policies are communicated at the time of purchase.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact
              </h2>
              <p>
                For questions about these terms, use our{" "}
                <Link href="/support" className="text-primary-600 hover:underline">
                  Contact Support
                </Link>{" "}
                page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
