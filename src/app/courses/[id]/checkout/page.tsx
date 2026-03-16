import { redirect, notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { courses, enrollments } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Complete Your Enrollment – Kulmis Academy",
  description: "Secure checkout for your premium learning experience.",
};

export const dynamic = "force-dynamic";

function formatPrice(price: number | null): string {
  if (price == null || price === 0) return "Free";
  return `$${price}`;
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const session = await getSession();
  if (!session) {
    redirect(`/signin?returnTo=${encodeURIComponent(`/courses/${courseId}/checkout`)}`);
  }

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const isPaid = course.price != null && course.price > 0;
  if (!isPaid) redirect(`/courses/${courseId}`);

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  if (enrollment) redirect(`/courses/${courseId}`);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Complete Your Enrollment</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Secure checkout for your premium learning experience.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1fr,1.2fr]">
            <section className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm smooth-transition order-2 lg:order-1">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 flex gap-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                      {course.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="mt-2 text-sm text-gray-500">Original Price</p>
                  <p className="text-xl font-semibold text-primary-600">{formatPrice(course.price)}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(course.price)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">30-Day Money-Back Guarantee</p>
            </section>

            <section className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm smooth-transition order-1 lg:order-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h2>
              <div className="mt-4 rounded-xl bg-gray-50 p-3 sm:p-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Somali mobile payment</p>
                <p className="mt-2">
                  Please send the course payment using one of the following mobile payment methods.
                </p>
                <ul className="mt-3 space-y-1">
                  <li><strong>EVC PLUS:</strong> +252613609678</li>
                  <li><strong>DAHABSHIIL:</strong> 623609678</li>
                </ul>
                <p className="mt-3">
                  After sending the payment, fill in the form below and submit your request.
                </p>
              </div>
              <CheckoutForm courseId={courseId} courseTitle={course.title} userName={session.name} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
