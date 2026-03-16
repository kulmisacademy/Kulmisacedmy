import { eq, and, gte, lt, sql, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  courses,
  lessons,
  enrollments,
  paymentRequests,
  progress,
  reviews,
} from "@/lib/schema";
import type { ActivityItem } from "@/components/admin/ActivityList";
import type { CourseRow } from "@/components/admin/CourseTable";

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setUTCDate(1);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export async function getDashboardStats() {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setUTCMonth(lastMonthStart.getUTCMonth() - 1);

  const [totalRevenueResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${courses.price}), 0)::int`,
    })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .where(eq(paymentRequests.status, "approved"));

  const totalRevenue = Number(totalRevenueResult?.total ?? 0);

  const thisMonthRevenueRows = await db
    .select({
      total: sql<number>`COALESCE(SUM(${courses.price}), 0)::int`,
    })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .where(
      and(
        eq(paymentRequests.status, "approved"),
        gte(paymentRequests.createdAt, thisMonthStart)
      )
    );
  const lastMonthRevenueRows = await db
    .select({
      total: sql<number>`COALESCE(SUM(${courses.price}), 0)::int`,
    })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .where(
      and(
        eq(paymentRequests.status, "approved"),
        gte(paymentRequests.createdAt, lastMonthStart),
        lt(paymentRequests.createdAt, thisMonthStart)
      )
    );
  const thisMonthRevenue = Number(thisMonthRevenueRows[0]?.total ?? 0);
  const lastMonthRevenue = Number(lastMonthRevenueRows[0]?.total ?? 0);
  const revenueGrowth =
    lastMonthRevenue > 0
      ? `+${(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)}%`
      : thisMonthRevenue > 0
        ? "+100%"
        : undefined;

  const [activeStudentsResult] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "student"));
  const activeStudents = activeStudentsResult?.count ?? 0;

  const [completedProgressResult] = await db
    .select({ count: count() })
    .from(progress)
    .where(eq(progress.completed, true));
  const totalLessonsResult = await db.select({ count: count() }).from(lessons);
  const totalLessons = totalLessonsResult.reduce((a, r) => a + r.count, 0);
  const completedCount = completedProgressResult?.count ?? 0;
  const courseCompletionRate =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const [newEnrollmentsResult] = await db
    .select({ count: count() })
    .from(enrollments)
    .where(gte(enrollments.enrolledAt, thisMonthStart));
  const newEnrollments = newEnrollmentsResult?.count ?? 0;

  const lastMonthEnrollmentsRows = await db
    .select({ count: count() })
    .from(enrollments)
    .where(
      and(
        gte(enrollments.enrolledAt, lastMonthStart),
        lt(enrollments.enrolledAt, thisMonthStart)
      )
    );
  const lastMonthEnrollmentsResult = lastMonthEnrollmentsRows[0];
  const lastMonthEnrollments = lastMonthEnrollmentsResult?.count ?? 0;
  const enrollmentGrowth =
    lastMonthEnrollments > 0
      ? `+${(((newEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100).toFixed(1)}%`
      : newEnrollments > 0
        ? "+100%"
        : undefined;

  const [prevStudentsResult] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.role, "student"),
        lt(users.createdAt, thisMonthStart)
      )
    );
  const prevStudents = prevStudentsResult?.count ?? 0;
  const studentsGrowth =
    prevStudents > 0
      ? `+${(((activeStudents - prevStudents) / prevStudents) * 100).toFixed(1)}%`
      : activeStudents > 0
        ? "+100%"
        : undefined;

  return {
    totalRevenue,
    revenueGrowth,
    activeStudents,
    studentsGrowth,
    courseCompletionRate,
    newEnrollments,
    enrollmentGrowth,
  };
}

export async function getMonthlyChartData() {
  const year = new Date().getFullYear();
  const approvedPayments = await db
    .select({
      price: courses.price,
      createdAt: paymentRequests.createdAt,
    })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .where(eq(paymentRequests.status, "approved"));

  const allEnrollments = await db
    .select({ enrolledAt: enrollments.enrolledAt })
    .from(enrollments);

  const revenueByMonth = new Array(12).fill(0);
  const enrollmentsByMonth = new Array(12).fill(0);

  for (const row of approvedPayments) {
    const d = row.createdAt ? new Date(row.createdAt) : null;
    if (d && d.getUTCFullYear() === year) {
      const m = d.getUTCMonth();
      revenueByMonth[m] += Number(row.price ?? 0);
    }
  }
  for (const row of allEnrollments) {
    const d = row.enrolledAt ? new Date(row.enrolledAt) : null;
    if (d && d.getUTCFullYear() === year) {
      const m = d.getUTCMonth();
      enrollmentsByMonth[m]++;
    }
  }

  return { revenueByMonth, enrollmentsByMonth };
}

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  type Row =
    | { type: "purchase"; title: string; userName: string; at: Date }
    | { type: "signup"; title: string; userName: string; at: Date }
    | { type: "published"; title: string; userName?: string; at: Date };

  const purchases = await db
    .select({
      title: courses.title,
      name: users.name,
      createdAt: paymentRequests.createdAt,
    })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .innerJoin(users, eq(paymentRequests.userId, users.id))
    .where(eq(paymentRequests.status, "approved"))
    .orderBy(desc(paymentRequests.createdAt))
    .limit(limit);

  const signups = await db
    .select({ name: users.name, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.role, "student"))
    .orderBy(desc(users.createdAt))
    .limit(limit);

  const published = await db
    .select({
      title: courses.title,
      instructorName: courses.instructorName,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .orderBy(desc(courses.createdAt))
    .limit(limit);

  const rows: Row[] = [
    ...purchases.map((p) => ({
      type: "purchase" as const,
      title: p.title,
      userName: p.name,
      at: new Date(p.createdAt),
    })),
    ...signups.map((s) => ({
      type: "signup" as const,
      title: s.name,
      userName: s.name,
      at: new Date(s.createdAt),
    })),
    ...published.map((c) => ({
      type: "published" as const,
      title: c.title,
      userName: c.instructorName ?? undefined,
      at: new Date(c.createdAt),
    })),
  ];

  rows.sort((a, b) => b.at.getTime() - a.at.getTime());

  function timeAgo(d: Date): string {
    const sec = (Date.now() - d.getTime()) / 1000;
    if (sec < 60) return "Just now";
    if (sec < 3600) return `${Math.floor(sec / 60)} mins ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hrs ago`;
    if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
    return d.toLocaleDateString();
  }

  return rows.slice(0, limit).map((r, i) => {
    const id = `${r.type}-${r.at.getTime()}-${i}`;
    const title =
      r.type === "signup" ? r.userName : r.title;
    const userName = r.type === "purchase" ? r.userName : r.type === "published" ? (r.userName ? `Instructor: ${r.userName}` : undefined) : r.userName;
    return {
      id,
      type: r.type,
      title,
      userName,
      timeAgo: timeAgo(r.at),
    };
  });
}

export async function getAnalyticsSummary() {
  const [totalStudents] = await db.select({ count: count() }).from(users).where(eq(users.role, "student"));
  const [totalCourses] = await db.select({ count: count() }).from(courses);
  const [totalRevenueRow] = await db
    .select({ total: sql<number>`COALESCE(SUM(${courses.price}), 0)::int` })
    .from(paymentRequests)
    .innerJoin(courses, eq(paymentRequests.courseId, courses.id))
    .where(eq(paymentRequests.status, "approved"));
  const [totalEnrollments] = await db.select({ count: count() }).from(enrollments);

  return {
    totalStudents: totalStudents?.count ?? 0,
    totalCourses: totalCourses?.count ?? 0,
    totalRevenue: Number(totalRevenueRow?.total ?? 0),
    totalEnrollments: totalEnrollments?.count ?? 0,
  };
}

export async function getCoursePopularity(limit = 10) {
  const enrollmentCounts = await db
    .select({
      courseId: enrollments.courseId,
      count: count(),
    })
    .from(enrollments)
    .groupBy(enrollments.courseId);

  const sorted = [...enrollmentCounts].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, limit);
  if (top.length === 0) return [];
  const courseList = await db.select({ id: courses.id, title: courses.title }).from(courses);
  const byId = Object.fromEntries(courseList.map((c) => [c.id, c.title]));

  return top.map((r) => ({
    courseId: r.courseId,
    title: byId[r.courseId] ?? `Course #${r.courseId}`,
    enrollments: r.count,
  }));
}

export type CoursePerformanceRow = {
  id: number;
  title: string;
  thumbnail: string | null;
  instructorName: string | null;
  enrollments: number;
  watching: number;
  completed: number;
  rating: number;
  status: "published" | "draft";
};

export async function getCoursePerformanceData(): Promise<CoursePerformanceRow[]> {
  const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));
  const allLessonsByCourse = await db
    .select({ courseId: lessons.courseId, lessonId: lessons.id })
    .from(lessons);
  const lessonCountByCourse: Record<number, number> = {};
  for (const row of allLessonsByCourse) {
    lessonCountByCourse[row.courseId] = (lessonCountByCourse[row.courseId] ?? 0) + 1;
  }

  const enrollmentCounts = await db
    .select({ courseId: enrollments.courseId, count: count() })
    .from(enrollments)
    .groupBy(enrollments.courseId);
  const enrollmentMap = Object.fromEntries(
    enrollmentCounts.map((r) => [r.courseId, r.count])
  );

  const enrollmentsList = await db.select().from(enrollments);
  const progressList = await db.select().from(progress).where(eq(progress.completed, true));
  const progressByUserLesson = new Set(progressList.map((p) => `${p.userId}-${p.lessonId}`));

  const lessonIdsByCourse: Record<number, number[]> = {};
  for (const row of allLessonsByCourse) {
    if (!lessonIdsByCourse[row.courseId]) lessonIdsByCourse[row.courseId] = [];
    lessonIdsByCourse[row.courseId].push(row.lessonId);
  }

  const watchingByCourse: Record<number, Set<number>> = {};
  const completedByCourse: Record<number, Set<number>> = {};
  for (const enr of enrollmentsList) {
    const lessonIds = lessonIdsByCourse[enr.courseId] ?? [];
    const totalLessons = lessonIds.length;
    if (totalLessons === 0) continue;
    let completedCount = 0;
    let hasWatched = false;
    for (const lid of lessonIds) {
      if (progressByUserLesson.has(`${enr.userId}-${lid}`)) {
        completedCount++;
        hasWatched = true;
      }
    }
    if (hasWatched) {
      if (!watchingByCourse[enr.courseId]) watchingByCourse[enr.courseId] = new Set();
      watchingByCourse[enr.courseId].add(enr.userId);
    }
    if (completedCount === totalLessons) {
      if (!completedByCourse[enr.courseId]) completedByCourse[enr.courseId] = new Set();
      completedByCourse[enr.courseId].add(enr.userId);
    }
  }

  const reviewAgg = await db
    .select({
      courseId: reviews.courseId,
      avg: sql<number>`COALESCE(AVG(${reviews.rating})::numeric(3,2), 0)`,
    })
    .from(reviews)
    .where(eq(reviews.status, "approved"))
    .groupBy(reviews.courseId);
  const ratingMap = Object.fromEntries(
    reviewAgg.map((r) => [r.courseId, Number(r.avg)])
  );

  return allCourses.map((c) => ({
    id: c.id,
    title: c.title,
    thumbnail: c.thumbnail,
    instructorName: c.instructorName,
    enrollments: enrollmentMap[c.id] ?? 0,
    watching: watchingByCourse[c.id]?.size ?? 0,
    completed: completedByCourse[c.id]?.size ?? 0,
    rating: ratingMap[c.id] ?? 0,
    status: "published" as const,
  }));
}

export async function getDashboardSummaryCards() {
  const [totalStudents] = await db.select({ count: count() }).from(users).where(eq(users.role, "student"));
  const [totalCourses] = await db.select({ count: count() }).from(courses);
  const [totalEnrollments] = await db.select({ count: count() }).from(enrollments);
  const allLessonsByCourse = await db.select({ courseId: lessons.courseId, id: lessons.id }).from(lessons);
  const lessonCountByCourse: Record<number, number> = {};
  for (const row of allLessonsByCourse) {
    lessonCountByCourse[row.courseId] = (lessonCountByCourse[row.courseId] ?? 0) + 1;
  }
  const progressList = await db.select().from(progress).where(eq(progress.completed, true));
  const progressByUserLesson = new Set(progressList.map((p) => `${p.userId}-${p.lessonId}`));
  const enrollmentsList = await db.select().from(enrollments);
  const lessonIdsByCourse: Record<number, number[]> = {};
  for (const row of allLessonsByCourse) {
    if (!lessonIdsByCourse[row.courseId]) lessonIdsByCourse[row.courseId] = [];
    lessonIdsByCourse[row.courseId].push(row.id);
  }
  let completedCoursesCount = 0;
  for (const enr of enrollmentsList) {
    const lessonIds = lessonIdsByCourse[enr.courseId] ?? [];
    if (lessonIds.length === 0) continue;
    const done = lessonIds.filter((lid) => progressByUserLesson.has(`${enr.userId}-${lid}`)).length;
    if (done === lessonIds.length) completedCoursesCount++;
  }

  return {
    totalStudents: totalStudents?.count ?? 0,
    totalCourses: totalCourses?.count ?? 0,
    totalEnrollments: totalEnrollments?.count ?? 0,
    completedCourses: completedCoursesCount,
  };
}

export async function getCourseTableData(includePerformance = false): Promise<CourseRow[]> {
  const rows = await getCoursePerformanceData();
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    thumbnail: r.thumbnail,
    instructorName: r.instructorName,
    students: r.enrollments,
    rating: r.rating,
    status: r.status,
    ...(includePerformance && {
      enrollments: r.enrollments,
      watching: r.watching,
      completed: r.completed,
    }),
  }));
}
