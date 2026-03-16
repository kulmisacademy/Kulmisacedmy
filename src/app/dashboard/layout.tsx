import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?returnTo=${encodeURIComponent("/dashboard")}`);
  }
  if (session.role === "admin") {
    redirect("/admin/dashboard");
  }
  const [user] = await db.select({ status: users.status }).from(users).where(eq(users.id, session.userId)).limit(1);
  if ((user?.status as string) === "blocked") {
    redirect("/blocked");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
                <nav className="mt-4 space-y-1">
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50"
                  >
                    All Courses
                  </Link>
                  <Link
                    href="/dashboard?filter=progress"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    In Progress
                  </Link>
                  <Link
                    href="/dashboard?filter=completed"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Completed
                  </Link>
                  <Link
                    href="/dashboard?filter=wishlist"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/dashboard?filter=archived"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Archived
                  </Link>
                </nav>
                <div className="mt-6 rounded-xl bg-primary-50 p-4">
                  <h3 className="font-semibold text-gray-900">New Here?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Unlock your full potential with expert-led courses.
                  </p>
                  <Link
                    href="/courses"
                    className="mt-3 inline-block w-full rounded-lg bg-primary-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-600"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
