import { redirect } from "next/navigation";
import Link from "next/link";
import { eq, asc, and } from "drizzle-orm";
import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { courses, enrollments, lessons } from "@/lib/schema";
import { CourseThumbnail } from "@/app/courses/[id]/CourseThumbnail";

export const metadata = {
  title: "My Courses – Kulmis Academy",
  description: "Your enrolled courses.",
};

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session || session.role === "admin") redirect("/");

  const myEnrollments = await db
    .select({
      courseId: enrollments.courseId,
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.status, "approved")));

  const lessonCounts = await db
    .select({ courseId: lessons.courseId, count: count() })
    .from(lessons)
    .groupBy(lessons.courseId);
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  const firstLessons = await Promise.all(
    myEnrollments.map(async (e) => {
      const [first] = await db
        .select({ id: lessons.id, title: lessons.title })
        .from(lessons)
        .where(eq(lessons.courseId, e.courseId))
        .orderBy(asc(lessons.lessonOrder))
        .limit(1);
      return { courseId: e.courseId, firstLessonId: first?.id, firstLessonTitle: first?.title };
    })
  );
  const firstLessonMap = Object.fromEntries(
    firstLessons.map((f) => [f.courseId, { id: f.firstLessonId, title: f.firstLessonTitle }])
  );

  const resumeEntry = myEnrollments.length > 0 ? firstLessonMap[myEnrollments[0].courseId] : null;
  const resumeCourse = myEnrollments[0]?.course;
  const resumeUrl =
    resumeEntry?.id && resumeCourse
      ? `/courses/${resumeCourse.id}/lessons/${resumeEntry.id}`
      : resumeCourse
        ? `/courses/${resumeCourse.id}`
        : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Courses</h1>
      <p className="mt-1 text-gray-600">
        Courses you have access to. Click Continue Learning to open the course player.
      </p>

      {resumeUrl && resumeCourse && resumeEntry && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-900 px-5 py-4 text-white shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-300">Resume where you left off</p>
            <p className="mt-1 font-semibold">
              {resumeEntry.title} in {resumeCourse.title}
            </p>
          </div>
          <Link
            href={resumeUrl}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-medium text-white hover:bg-primary-400 btn-neon"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Continue Learning
          </Link>
        </div>
      )}

      {myEnrollments.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm">
          <p className="text-gray-600">You're not enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myEnrollments.map(({ course }) => {
            const lessonCount = countMap[course.id] ?? 0;
            const first = firstLessonMap[course.id];
            const continueUrl = first?.id
              ? `/courses/${course.id}/lessons/${first.id}`
              : `/courses/${course.id}`;
            return (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm card-hover"
              >
                <Link href={`/courses/${course.id}`} className="block aspect-video w-full shrink-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gray-100">
                  <CourseThumbnail src={course.thumbnail} title={course.title} />
                </Link>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h2>
                  {course.instructorName && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">By {course.instructorName}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">{lessonCount} lesson{lessonCount !== 1 ? "s" : ""}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">0% complete</p>
                  <Link
                    href={continueUrl}
                    prefetch={false}
                    className="mt-4 inline-flex justify-center items-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 btn-neon w-full sm:w-auto"
                  >
                    Continue Learning
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
