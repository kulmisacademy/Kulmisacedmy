import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { courses, categories } from "@/lib/schema";
import { desc, count } from "drizzle-orm";
import { lessons } from "@/lib/schema";
import { CourseThumbnail } from "@/app/courses/[id]/CourseThumbnail";
import { CourseFilters } from "./CourseFilters";

export const metadata = {
  title: "Explore Courses – Kulmis Academy",
  description: "Master new technical skills with expert curriculum and hands-on projects.",
};

export const dynamic = "force-dynamic";

const COURSES_PER_PAGE = 9;

function shortDescription(description: string | null, maxLength = 100): string {
  if (!description) return "";
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category: categorySlug } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [categoriesList, allCoursesRaw] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select().from(courses).orderBy(desc(courses.createdAt)),
  ]);

  const categoryIdFilter =
    categorySlug && categorySlug !== "all"
      ? categoriesList.find((c) => c.slug === categorySlug)?.id ?? null
      : null;

  const allCourses =
    categoryIdFilter != null
      ? allCoursesRaw.filter((c) => c.categoryId === categoryIdFilter)
      : allCoursesRaw;

  const lessonCounts = await db
    .select({ courseId: lessons.courseId, count: count() })
    .from(lessons)
    .groupBy(lessons.courseId);
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  const total = allCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / COURSES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedCourses = allCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Explore Courses</h1>
            <p className="mt-2 text-gray-600">
              Master new technical skills with expert curriculum and hands-on projects.
            </p>
          </section>

          <CourseFilters
            categories={categoriesList}
            currentSlug={categorySlug ?? null}
          />

          {paginatedCourses.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center shadow-sm">
              <p className="text-gray-500">No courses available yet. Check back soon.</p>
              <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedCourses.map((course) => {
                  const lessonCount = countMap[course.id] ?? 0;
                  return (
                    <article
                      key={course.id}
                      className="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm card-hover"
                    >
                      <Link href={`/courses/${course.id}`} className="block shrink-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                        <CourseThumbnail src={course.thumbnail} title={course.title} />
                      </Link>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary-600 smooth-transition line-clamp-2">
                          <Link href={`/courses/${course.id}`}>{course.title}</Link>
                        </h2>
                        {course.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {shortDescription(course.description)}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-medium text-gray-500">
                          {lessonCount} Lesson{lessonCount !== 1 ? "s" : ""}
                        </p>
                        {course.instructorName && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                              {course.instructorName.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-600">{course.instructorName}</span>
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {course.price != null && course.price > 0 ? `$${course.price}` : "Free"}
                          </span>
                          <Link
                            href={`/courses/${course.id}`}
                            className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-primary-600 btn-neon"
                          >
                            View Course
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                  {(() => {
                    const q = categorySlug && categorySlug !== "all" ? `category=${encodeURIComponent(categorySlug)}&` : "";
                    const prev = currentPage <= 1 ? "#" : `/courses?${q}page=${currentPage - 1}`;
                    const next = currentPage >= totalPages ? "#" : `/courses?${q}page=${currentPage + 1}`;
                    return (
                      <>
                        <Link
                          href={prev}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            currentPage <= 1
                              ? "cursor-not-allowed border-gray-200 text-gray-400"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </Link>
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                              key={p}
                              href={`/courses?${q}page=${p}`}
                              className={`min-w-[2.5rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors ${
                                p === currentPage
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {p}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={next}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            currentPage >= totalPages
                              ? "cursor-not-allowed border-gray-200 text-gray-400"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </Link>
                      </>
                    );
                  })()}
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
