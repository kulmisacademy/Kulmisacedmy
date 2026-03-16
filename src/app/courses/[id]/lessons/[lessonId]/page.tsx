import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq, asc, and, desc } from "drizzle-orm";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { courses, lessons, enrollments, lessonResources, users, paymentRequests } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { getVideoEmbed } from "@/lib/video";
import { LessonPlayerTabs } from "./LessonPlayerTabs";
import { LessonListSlide } from "./LessonListSlide";
import { markLessonComplete } from "./actions";

export const metadata = {
  title: "Lesson – Kulmis Academy",
  description: "Watch lesson.",
};

export const dynamic = "force-dynamic";

function formatDuration(minutes: number | null): string {
  if (minutes == null) return "";
  const m = Math.floor(minutes);
  return `${m.toString().padStart(2, "0")}:00`;
}

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const courseId = parseInt(id, 10);
  const lessonIdNum = parseInt(lessonId, 10);
  if (isNaN(courseId) || isNaN(lessonIdNum)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const allLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.lessonOrder));

  const currentIndex = allLessons.findIndex((l) => l.id === lessonIdNum);
  const currentLesson = currentIndex >= 0 ? allLessons[currentIndex] : null;
  if (!currentLesson) notFound();

  const session = await getSession();
  if (session) {
    const [user] = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if ((user?.status as string) === "blocked") redirect("/blocked");
  }

  const isPaidCourse = course.price != null && course.price > 0;

  // Enforce access rules:
  // - Must be logged in for all non-preview lessons
  // - Free course: logged-in students can watch (and enrolling adds it to My Courses)
  // - Paid course: require an approved enrollment (created when admin approves payment)
  if (!session && !currentLesson.isPreview) {
    redirect(`/courses/${courseId}`);
  }

  let canAccess = !!currentLesson.isPreview;

  if (session && !canAccess) {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
      .limit(1);

    if (!isPaidCourse) {
      // Free course: any logged-in student with or without enrollment can watch.
      canAccess = true;
    } else {
      // Paid course: only allow if an enrollment exists (payment approved).
      canAccess = !!enrollment;

      if (!canAccess) {
        // If there's a pending payment request, send the student back with a friendly message.
        const [pendingReq] = await db
          .select()
          .from(paymentRequests)
          .where(
            and(
              eq(paymentRequests.userId, session.userId),
              eq(paymentRequests.courseId, courseId)
            )
          )
          .orderBy(desc(paymentRequests.createdAt))
          .limit(1);

        if (pendingReq && pendingReq.status === "pending") {
          redirect(`/courses/${courseId}?pending=1`);
        }
      }
    }
  }

  if (!canAccess) {
    // For paid courses without enrollment, send to checkout. Otherwise back to course page.
    if (isPaidCourse) {
      redirect(`/courses/${courseId}/checkout?mustEnroll=1`);
    }
    redirect(`/courses/${courseId}`);
  }

  if (session && !currentLesson.isPreview) {
    await markLessonComplete(session.userId, lessonIdNum);
  }

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const videoEmbed = getVideoEmbed(currentLesson.videoUrl);
  const embedUrl = videoEmbed?.embedUrl ?? null;
  const progressPercent = allLessons.length > 0 ? Math.round(((currentIndex + 1) / allLessons.length) * 100) : 0;

  const resources = await db
    .select()
    .from(lessonResources)
    .where(eq(lessonResources.lessonId, lessonIdNum));

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 min-w-0">
            <Link href="/dashboard" className="hover:text-primary-600 shrink-0">Learning</Link>
            <span aria-hidden className="shrink-0">/</span>
            <Link href={`/courses/${courseId}`} className="hover:text-primary-600 truncate min-w-0 max-w-[120px] sm:max-w-[200px]">{course.title}</Link>
            <span aria-hidden className="shrink-0">/</span>
            <span className="text-gray-900 truncate min-w-0 max-w-[100px] sm:max-w-none">{currentLesson.title}</span>
          </nav>

          {/* Lesson progress bar */}
          <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2 gap-2">
              <span className="font-medium shrink-0">Lesson {currentIndex + 1} of {allLessons.length}</span>
              <span className="shrink-0">{progressPercent}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Desktop: sidebar left. Mobile: hidden; use LessonListSlide instead. */}
            <aside className="hidden lg:block w-full lg:w-80 xl:w-96 shrink-0 order-2 lg:order-1">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sticky top-24">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Course Content</h2>
                  <Link
                    href={`/courses/${courseId}`}
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    View Entire Course
                  </Link>
                </div>
                <ul className="mt-4 space-y-1 max-h-[60vh] overflow-y-auto">
                  {allLessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm smooth-transition ${
                          lesson.id === currentLesson.id
                            ? "bg-primary-50 font-medium text-primary-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <span className="truncate flex-1">{lesson.title}</span>
                        {lesson.duration != null && (
                          <span className="shrink-0 text-gray-400">
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="mt-4 block w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Join Discussion
                </Link>
                {course.instructorName && (
                  <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                      {course.instructorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.instructorName}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0 flex-1 order-1 lg:order-2">
              {/* 16:9 responsive video container */}
              <div className="relative rounded-xl overflow-hidden bg-black w-full shadow-lg ring-1 ring-gray-200/50 aspect-video">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={currentLesson.title}
                    className="absolute top-0 left-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 p-4">
                    <div className="text-center text-sm sm:text-base">
                      <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <p className="mt-2">No video URL set for this lesson.</p>
                      <p className="text-xs sm:text-sm">Add a Vimeo or YouTube link in the admin.</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Mobile: Lessons button (opens slide sidebar); desktop sidebar is in aside above */}
              <div className="mt-3 lg:hidden">
                <LessonListSlide
                  lessons={allLessons.map((l) => ({ id: l.id, title: l.title, duration: l.duration }))}
                  courseId={courseId}
                  currentLessonId={currentLesson.id}
                  courseTitle={course.title}
                />
              </div>
              <h1 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl smooth-transition">{currentLesson.title}</h1>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                {prevLesson ? (
                  <Link
                    href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary-200 smooth-transition btn-neon"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Previous Lesson
                  </Link>
                ) : null}
                <Link
                  href={nextLesson ? `/courses/${courseId}/lessons/${nextLesson.id}` : `/courses/${courseId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-medium text-white hover:bg-primary-600 shadow-md smooth-transition btn-neon"
                >
                  {nextLesson ? (
                    <>
                      Next Lesson
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  ) : (
                    "Back to course"
                  )}
                </Link>
              </div>

              <LessonPlayerTabs overviewContent={currentLesson.description} resources={resources} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
