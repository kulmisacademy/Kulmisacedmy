import Link from "next/link";
import { desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/schema";
import { DeleteCourseButton } from "./DeleteCourseButton";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));

  const lessonCounts = await db
    .select({ courseId: lessons.courseId, count: count() })
    .from(lessons)
    .groupBy(lessons.courseId);
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
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
          <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Course Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Lessons</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allCourses.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/dashboard/courses/${c.id}`} className="font-medium text-gray-900 hover:text-primary-600 hover:underline">
                      {c.title}
                    </Link>
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
