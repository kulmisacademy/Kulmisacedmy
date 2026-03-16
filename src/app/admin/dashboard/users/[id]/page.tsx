import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, enrollments, courses, lessons, progress } from "@/lib/schema";
import { UserStatusSelect } from "../UserStatusSelect";
import { DeleteUserButton } from "../DeleteUserButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserProfilePage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) notFound();

  const userEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, userId));

  const courseIds = userEnrollments.map((e) => e.courseId);
  const allCoursesMap: Record<number, { title: string; id: number }> = {};
  if (courseIds.length > 0) {
    const allC = await db.select({ id: courses.id, title: courses.title }).from(courses).where(inArray(courses.id, courseIds));
    allC.forEach((c) => (allCoursesMap[c.id] = { id: c.id, title: c.title }));
  }

  const allLessonsForCourses = await db
    .select({ courseId: lessons.courseId, id: lessons.id })
    .from(lessons);
  const lessonCountByCourse: Record<number, number> = {};
  const lessonIdsByCourse: Record<number, number[]> = {};
  for (const row of allLessonsForCourses) {
    lessonCountByCourse[row.courseId] = (lessonCountByCourse[row.courseId] ?? 0) + 1;
    if (!lessonIdsByCourse[row.courseId]) lessonIdsByCourse[row.courseId] = [];
    lessonIdsByCourse[row.courseId].push(row.id);
  }

  const progressRows = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.completed, true)));
  const completedLessonIds = new Set(progressRows.map((p) => p.lessonId));

  const enrollmentsWithProgress = userEnrollments.map((e) => {
    const totalLessons = lessonCountByCourse[e.courseId] ?? 0;
    const lessonIds = lessonIdsByCourse[e.courseId] ?? [];
    const completed = lessonIds.filter((lid) => completedLessonIds.has(lid)).length;
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    const status = totalLessons > 0 && completed === totalLessons ? "Completed" : "In Progress";
    const course = allCoursesMap[e.courseId];
    return {
      courseId: e.courseId,
      courseTitle: course?.title ?? `Course #${e.courseId}`,
      progressPercent: percent,
      status,
    };
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/dashboard/users"
          className="text-sm text-primary-600 hover:underline dark:text-primary-400"
        >
          ← Back to users
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">User profile</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Full name</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Phone</dt>
            <dd className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Role</dt>
            <dd className="mt-0.5">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.role === "admin" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                {user.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="mt-0.5">
              <UserStatusSelect userId={user.id} currentStatus={(user as { status?: string }).status ?? "active"} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Registration date</dt>
            <dd className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          {user.role !== "admin" && (
            <DeleteUserButton userId={user.id} userName={user.name} />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled courses</h2>
        {enrollmentsWithProgress.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">This user has not enrolled in any courses.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {enrollmentsWithProgress.map((e) => (
              <li
                key={e.courseId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/dashboard/courses/${e.courseId}/edit`}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {e.courseTitle}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Progress: {e.progressPercent}% · {e.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${e.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                    {e.status}
                  </span>
                  <Link
                    href={`/courses/${e.courseId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                  >
                    View course →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
