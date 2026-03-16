import Link from "next/link";
import { desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/schema";
import { DeleteCourseButton } from "./DeleteCourseButton";
import { CourseThumbnailCell } from "./CourseThumbnailCell";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorParam } = await searchParams;
  const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));

  const lessonCounts = await db
    .select({ courseId: lessons.courseId, count: count() })
    .from(lessons)
    .groupBy(lessons.courseId);
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  return (
    <div>
      {errorParam === "delete" && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Failed to delete course. Please try again.
        </p>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <Link
          href="/admin/dashboard/courses/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Create course
        </Link>
      </div>
      {allCourses.length === 0 ? (
        <p className="mt-6 text-gray-600">No courses yet. Create your first course to get started.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Lessons</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {allCourses.map((c) => (
                <tr key={c.id} className="dark:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CourseThumbnailCell thumbnail={c.thumbnail} title={c.title} />
                      <Link href={`/admin/dashboard/courses/${c.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 hover:underline">
                        {c.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{countMap[c.id] ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600">{c.price == null || c.price === 0 ? "Free" : `$${c.price}`}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/dashboard/courses/${c.id}/edit`}
                      className="text-primary-600 hover:underline text-sm mr-3"
                    >
                      Edit
                    </Link>
                    <DeleteCourseButton courseId={c.id} courseTitle={c.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
