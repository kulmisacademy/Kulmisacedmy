import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, categories } from "@/lib/schema";
import { EditCourseForm } from "./EditCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminEditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const categoriesList = await db.select().from(categories).orderBy(asc(categories.name));

  return (
    <div>
      <Link href={`/admin/dashboard/courses/${courseId}`} className="text-sm text-primary-600 hover:underline">
        ← Back to course
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit course</h1>
      <EditCourseForm course={course} categories={categoriesList} />
    </div>
  );
}
