"use client";

import Link from "next/link";
import { useDashboardCourses } from "@/hooks/use-dashboard-courses";
import { CourseThumbnail } from "@/app/courses/[id]/CourseThumbnail";

export function DashboardCoursesClient() {
  const { data: enrollments, isLoading, error } = useDashboardCourses();

  if (isLoading) {
    return (
      <div className="mt-6">
        <p className="text-gray-500">Loading your courses…</p>
      </div>
    );
  }
  if (error || !enrollments) {
    return (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>Could not load courses. Please refresh the page.</p>
      </div>
    );
  }

  const resumeEntry = enrollments.length > 0 ? enrollments[0].firstLesson : null;
  const resumeCourse = enrollments[0];
  const resumeUrl =
    resumeEntry?.id && resumeCourse
      ? `/courses/${resumeCourse.id}/lessons/${resumeEntry.id}`
      : resumeCourse
        ? `/courses/${resumeCourse.id}`
        : null;

  return (
    <>
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

      {enrollments.length === 0 ? (
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
          {enrollments.map((course) => {
            const lessonCount = course.lessonCount ?? 0;
            const first = course.firstLesson;
            const continueUrl = first?.id
              ? `/courses/${course.id}/lessons/${first.id}`
              : `/courses/${course.id}`;
            return (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm card-hover"
              >
                <Link
                  href={`/courses/${course.id}`}
                  className="block aspect-video w-full shrink-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gray-100"
                >
                  <CourseThumbnail src={course.thumbnail} title={course.title} />
                </Link>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h2>
                  {course.instructorName && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      By {course.instructorName}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                  </p>
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
    </>
  );
}
