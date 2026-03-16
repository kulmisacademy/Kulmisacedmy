import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy – Kulmis Academy",
  description: "Privacy policy for Kulmis Academy e-learning platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-primary-600 hover:underline">
            ← Back to home
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>
          <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Information we collect
              </h2>
              <p>
                We collect information you provide when you register (name, email, phone number),
                when you enroll in courses, and when you contact support. We use this to deliver
                the service, process payments, and communicate with you.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                How we use your information
              </h2>
              <p>
                Your data is used to manage your account, course access, and support requests.
                We do not sell your personal information to third parties.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact
              </h2>
              <p>
                For privacy-related questions, contact us via the{" "}
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
