import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, categories, courseResources } from "@/lib/schema";
import { EditCourseForm } from "./EditCourseForm";
import { CourseResourcesSection } from "./CourseResourcesSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; warning?: string }>;
}) {
  const { id } = await params;
  const { error: errorParam, saved: savedParam, warning: warningParam } = await searchParams;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <h1 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Course not found</h1>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          This course may have been deleted or does not exist.
        </p>
        <Link
          href="/admin/dashboard/courses"
          className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
        >
          ← Back to courses
        </Link>
      </div>
    );
  }

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
      <EditCourseForm course={course} categories={categoriesList} errorParam={errorParam} savedParam={savedParam} warningParam={warningParam} />
      <CourseResourcesSection courseId={courseId} resources={resourcesList} />
    </div>
  );
}
