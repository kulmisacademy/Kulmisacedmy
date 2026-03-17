import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/schema";
import { AddLessonForm } from "./AddLessonForm";
import { LessonRow } from "./LessonRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.lessonOrder));

  return (
    <div>
      <Link href="/admin/dashboard/courses" className="text-sm text-primary-600 hover:underline">
        ← Back to courses
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <Link
          href={`/admin/dashboard/courses/${courseId}/edit`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit course
        </Link>
      </div>
      <p className="mt-2 text-gray-600">{courseLessons.length} lesson(s)</p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
        <AddLessonForm courseId={courseId} />
        {courseLessons.length === 0 ? (
          <p className="mt-4 text-gray-500">No lessons yet. Add one above.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {courseLessons.map((lesson, index) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={index}
                total={courseLessons.length}
                courseId={courseId}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
