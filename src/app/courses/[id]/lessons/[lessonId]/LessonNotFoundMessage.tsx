"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/** Client-only card with Try again button. Parent (server) must render HeaderWithSession and Footer. */
export function LessonNotFoundMessage({
  courseId,
  isCourseMissing,
}: {
  courseId?: number;
  isCourseMissing?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
      <h1 className="text-xl font-bold text-amber-800 dark:text-amber-200">
        {isCourseMissing ? "Course not found" : "Lesson not found"}
      </h1>
      <p className="mt-3 text-amber-700 dark:text-amber-300">
        {isCourseMissing
          ? "This course may have been removed or the link is incorrect."
          : "This lesson may have been removed or the link is incorrect. Try opening the course and choosing a lesson from the list."}
      </p>
      <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
        If you just enrolled, try again to load the latest data.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-block rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
        >
          Try again
        </button>
        {courseId && (
          <Link
            href={`/courses/${courseId}`}
            className="inline-block rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-gray-800 dark:text-amber-200 dark:hover:bg-amber-900/30"
          >
            Back to course
          </Link>
        )}
        <Link
          href="/courses"
          className="inline-block rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-gray-800 dark:text-amber-200 dark:hover:bg-amber-900/30"
        >
          Browse courses
        </Link>
      </div>
    </div>
  );
}
