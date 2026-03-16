import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, type Course } from "@/lib/schema";
import { CourseThumbnail } from "@/app/courses/[id]/CourseThumbnail";

export const dynamic = "force-dynamic";

function shortDescription(description: string | null, maxLength = 80): string {
  if (!description) return "";
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
}

export default async function FeaturedCourses() {
  let allCourses: Course[] = [];
  try {
    allCourses = await db
      .select()
      .from(courses)
      .orderBy(desc(courses.createdAt))
      .limit(6);
  } catch {
    // DATABASE_URL not set or connection failed – show empty state so home page still loads
  }

  return (
    <section id="courses" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured <span className="text-accent-pink">Courses</span>
            </h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              Master the in-demand skills with our industry-leading curriculum
              and expert instructors.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-primary-600 font-medium hover:text-primary-700 hover:underline shrink-0"
          >
            View all courses →
          </Link>
        </div>

        {allCourses.length === 0 ? (
          <p className="text-gray-500">No courses yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((course) => (
              <article
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-xl card-hover"
              >
                <Link href={`/courses/${course.id}`} className="block shrink-0 overflow-hidden rounded-t-2xl">
                  <CourseThumbnail src={course.thumbnail} title={course.title} />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    <Link href={`/courses/${course.id}`} className="hover:text-primary-600 transition-colors">
                      {course.title}
                    </Link>
                  </h3>
                  {course.description && (
                    <p className="mt-2 flex-1 line-clamp-2 text-gray-600 text-sm">
                      {shortDescription(course.description)}
                    </p>
                  )}
                  <p className="mt-4 text-lg font-semibold text-gray-900">
                    {course.price != null && course.price > 0 ? `$${course.price}` : "Free"}
                  </p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="mt-6 inline-flex justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
