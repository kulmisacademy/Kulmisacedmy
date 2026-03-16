import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, categories, courseResources } from "@/lib/schema";
import { EditCourseForm } from "./EditCourseForm";
import { CourseResourcesSection } from "./CourseResourcesSection";

export const dynamic = "force-dynamic";

export default async function AdminEditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: errorParam } = await searchParams;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const [categoriesList, resourcesList] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.name)),
    db.select().from(courseResources).where(eq(courseResources.courseId, courseId)),
  ]);

  return (
    <div>
      <Link href={`/admin/dashboard/courses/${courseId}`} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
        ← Back to course
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Edit course</h1>
      <EditCourseForm course={course} categories={categoriesList} errorParam={errorParam} />
      <CourseResourcesSection courseId={courseId} resources={resourcesList} />
    </div>
  );
}
