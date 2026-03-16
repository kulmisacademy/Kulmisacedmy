import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { CreateCourseForm } from "./CreateCourseForm";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const categoriesList = await db.select().from(categories).orderBy(asc(categories.name));
  return (
    <div>
      <Link
        href="/admin/dashboard/courses"
        className="text-sm text-primary-600 hover:underline"
      >
        ← Back to courses
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Create course</h1>
      <p className="mt-2 text-gray-600">
        Add a new course. You can add lessons after the course is created.
      </p>
      <CreateCourseForm categories={categoriesList} />
    </div>
  );
}
