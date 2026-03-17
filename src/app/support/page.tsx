import { getSession } from "@/lib/auth";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { SupportForm } from "./SupportForm";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact support</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Send a message and we’ll get back to you as soon as possible.
          </p>
          <SupportForm
            defaultName={session?.name ?? ""}
            defaultEmail={session?.email ?? ""}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
