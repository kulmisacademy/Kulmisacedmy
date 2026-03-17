import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { courses, lessons, enrollments, users, reviews, courseResources, paymentRequests } from "@/lib/schema";
import { eq, asc, and } from "drizzle-orm";
import { CourseResourcesBlock } from "./CourseResourcesBlock";
import { getSession } from "@/lib/auth";
import { EnrollSection } from "./EnrollSection";
import { CourseThumbnail } from "./CourseThumbnail";
import { ReviewForm } from "./ReviewForm";
import { CourseReviewsSection } from "./CourseReviewsSection";

export const metadata = {
  title: "Course – Kulmis Academy",
  description: "Course details and curriculum.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatPrice(price: number | null): string {
  if (price == null || price === 0) return "Free";
  return `$${price}`;
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; pending?: string }>;
}) {
  const { id } = await params;
  const { message: messageParam, pending: pendingParam } = await searchParams;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const session = await getSession();
  let isEnrolled = false;
  let userPhone: string | null = null;
  let hasPendingPayment = false;
  if (session) {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
      .limit(1);
    const enrollmentStatus = (enrollment as { status?: string } | undefined)?.status ?? "approved";
    isEnrolled = !!enrollment && enrollmentStatus === "approved";
    const [pendingReq] = await db
      .select()
      .from(paymentRequests)
      .where(
        and(
          eq(paymentRequests.userId, session.userId),
          eq(paymentRequests.courseId, courseId)
        )
      )
      .limit(1);
    hasPendingPayment = !!pendingReq && pendingReq.status === "pending";
    const [userRow] = await db.select({ phone: users.phone }).from(users).where(eq(users.id, session.userId)).limit(1);
    userPhone = userRow?.phone ?? null;
  }

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.lessonOrder));

  const learningOutcomes = course.learningOutcomes
    ? course.learningOutcomes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [approvedReviews, resourcesList] = await Promise.all([
    db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        courseId: reviews.courseId,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        status: reviews.status,
        createdAt: reviews.createdAt,
        userName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.courseId, courseId), eq(reviews.status, "approved"))),
    db.select().from(courseResources).where(eq(courseResources.courseId, courseId)),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <Link href="/courses" className="text-sm text-primary-600 hover:underline">
            ← Back to courses
          </Link>

          <div className="mt-4 sm:mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-[1fr,2fr] p-4 sm:p-6 lg:p-8">
              <div>
                <CourseThumbnail src={course.thumbnail} title={course.title} subtitle={course.description ? course.description.slice(0, 100).trim() + (course.description.length > 100 ? "…" : "") : undefined} />
                <p className="mt-4 text-2xl font-bold text-gray-900">{formatPrice(course.price)}</p>
                {((messageParam === "enroll" && !isEnrolled) || pendingParam === "1" || messageParam === "rejected") && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                    {messageParam === "rejected"
                      ? "Your access request was not approved. Please contact support if you believe this is an error."
                      : pendingParam === "1"
                        ? "Your request is waiting for admin approval. Please wait."
                        : "You must enroll in this course before watching lessons."}
                  </div>
                )}
                <EnrollSection
                  courseId={courseId}
                  courseTitle={course.title}
                  price={course.price}
                  isEnrolled={isEnrolled}
                  isLoggedIn={!!session}
                  userName={session?.name}
                  userPhone={userPhone}
                  hasPendingPayment={hasPendingPayment}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{course.title}</h1>
                {course.instructorName && (
                  <p className="mt-2 text-gray-600">Instructor: {course.instructorName}</p>
                )}
                <p className="mt-2 text-gray-500 text-sm">
                  {courseLessons.length} lesson{courseLessons.length !== 1 ? "s" : ""}
                </p>
                {course.description && (
                  <p className="mt-4 text-gray-600">{course.description}</p>
                )}

                {learningOutcomes.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">What You Will Learn</h2>
                    <ul className="mt-3 space-y-2">
                      {learningOutcomes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <span className="text-primary-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
            <p className="mt-1 text-gray-500 text-sm">Lessons in order</p>
            {courseLessons.length === 0 ? (
              <p className="mt-4 text-gray-500">No lessons published yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {courseLessons.map((lesson, index) => {
                  const isPaidCourse = course.price != null && course.price > 0;
                  const canAccess = isEnrolled || (!isPaidCourse && !!lesson.isPreview);
                  return (
                    <li key={lesson.id}>
                      {canAccess ? (
                        <Link
                          href={`/courses/${courseId}/lessons/${lesson.id}`}
                          prefetch={false}
                          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md hover:border-primary-200"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900">
                              Lesson {index + 1} — {lesson.title}
                            </span>
                            {lesson.duration != null && (
                              <span className="ml-2 text-sm text-gray-500">{lesson.duration} min</span>
                            )}
                          </div>
                          <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </Link>
                      ) : isPaidCourse && session ? (
                        <Link
                          href={`/courses/${courseId}/checkout?message=request`}
                          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-500 hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-sm text-gray-500">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-600">
                              Lesson {index + 1} — {lesson.title}
                            </span>
                            {lesson.duration != null && (
                              <span className="ml-2 text-sm text-gray-400">{lesson.duration} min</span>
                            )}
                          </div>
                          <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400" title="Locked — Request access">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-500">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-sm text-gray-500">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-600">
                              Lesson {index + 1} — {lesson.title}
                            </span>
                            {lesson.duration != null && (
                              <span className="ml-2 text-sm text-gray-400">{lesson.duration} min</span>
                            )}
                          </div>
                          <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400" title="Locked">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {isEnrolled && resourcesList.length > 0 && (
            <CourseResourcesBlock resources={resourcesList} />
          )}

          {isEnrolled && (
            <div className="mt-10">
              <ReviewForm courseId={courseId} />
            </div>
          )}

          <CourseReviewsSection reviews={approvedReviews} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
