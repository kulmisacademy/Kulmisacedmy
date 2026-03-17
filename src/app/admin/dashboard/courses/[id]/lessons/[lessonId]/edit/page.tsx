import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, lessonResources } from "@/lib/schema";
import { EditLessonForm } from "./EditLessonForm";
import { AddLessonResourceForm } from "./AddLessonResourceForm";
import { LessonResourceRow } from "./LessonResourceRow";

export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; lessonId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id, lessonId } = await params;
  const { error: resourceError } = await searchParams;
  const courseId = parseInt(id, 10);
  const lessonIdNum = parseInt(lessonId, 10);
  if (isNaN(courseId) || isNaN(lessonIdNum)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonIdNum)).limit(1);
  if (!lesson || lesson.courseId !== courseId) notFound();

  const resources = await db
    .select()
    .from(lessonResources)
    .where(eq(lessonResources.lessonId, lessonIdNum));

  return (
    <div>
      <Link
        href={`/admin/dashboard/courses/${courseId}`}
        className="text-sm text-primary-600 hover:underline"
      >
        ← Back to course
      </Link>
      <div className="mt-4">
        <h1 className="text-xl font-bold text-gray-900">Edit lesson</h1>
        <p className="mt-1 text-sm text-gray-500">{course.title}</p>
        <EditLessonForm lesson={lesson} courseId={courseId} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Lesson resources</h2>
        <p className="mt-1 text-sm text-gray-500">PDFs, links, project files students can access below the video.</p>
        <AddLessonResourceForm lessonId={lessonIdNum} courseId={courseId} errorParam={resourceError} />
        {resources.length > 0 && (
          <ul className="mt-4 space-y-2">
            {resources.map((r) => (
              <LessonResourceRow key={r.id} resource={r} lessonId={lessonIdNum} courseId={courseId} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
