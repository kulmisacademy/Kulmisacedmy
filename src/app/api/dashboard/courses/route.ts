import { NextResponse } from "next/server";
import { eq, asc, and } from "drizzle-orm";
import { count } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, enrollments, lessons } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getSession();
  if (!session || session.role === "admin") {
    return NextResponse.json(null, { status: 401 });
  }

  const myEnrollments = await db
    .select({
      courseId: enrollments.courseId,
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.status, "approved")));

  const lessonCounts = await db
    .select({ courseId: lessons.courseId, count: count() })
    .from(lessons)
    .groupBy(lessons.courseId);
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  const firstLessons = await Promise.all(
    myEnrollments.map(async (e) => {
      const [first] = await db
        .select({ id: lessons.id, title: lessons.title })
        .from(lessons)
        .where(eq(lessons.courseId, e.courseId))
        .orderBy(asc(lessons.lessonOrder))
        .limit(1);
      return { courseId: e.courseId, firstLessonId: first?.id, firstLessonTitle: first?.title };
    })
  );
  const firstLessonMap = Object.fromEntries(
    firstLessons.map((f) => [f.courseId, { id: f.firstLessonId, title: f.firstLessonTitle }])
  );

  const items = myEnrollments.map(({ course }) => ({
    ...course,
    lessonCount: countMap[course.id] ?? 0,
    firstLesson: firstLessonMap[course.id],
  }));

  return NextResponse.json({ enrollments: items });
}
