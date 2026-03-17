import { NextResponse } from "next/server";
import { eq, asc, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { checkOrCreateUserSession } from "@/lib/session-access";
import { db } from "@/lib/db";
import {
  courses,
  lessons,
  enrollments,
  users,
  lessonResources,
  courseResources,
  paymentRequests,
} from "@/lib/schema";
import { getVideoEmbed } from "@/lib/video";
import { markLessonComplete } from "@/app/courses/[id]/lessons/[lessonId]/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const { id, lessonId: lessonIdParam } = await params;
  const courseId = parseInt(id, 10);
  const lessonIdNum = parseInt(lessonIdParam, 10);
  if (isNaN(courseId) || isNaN(lessonIdNum)) {
    return NextResponse.json({ error: "Invalid id", blockReason: "not_found" as const }, { status: 404 });
  }

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) {
    return NextResponse.json({ error: "Course not found", blockReason: "course_missing" as const }, { status: 404 });
  }

  const allLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.lessonOrder));

  const currentIndex = allLessons.findIndex((l) => l.id === lessonIdNum);
  const currentLesson = currentIndex >= 0 ? allLessons[currentIndex] : null;
  if (!currentLesson) {
    return NextResponse.json({ error: "Lesson not found", blockReason: "not_found" as const }, { status: 404 });
  }

  const session = await getSession();
  if (!session && !currentLesson.isPreview) {
    return NextResponse.json(
      { redirectTo: `/signin?returnTo=${encodeURIComponent(`/courses/${courseId}/lessons/${lessonIdNum}`)}` },
      { status: 401 }
    );
  }

  if (session) {
    const [user] = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if ((user?.status as string) === "blocked") {
      return NextResponse.json({ redirectTo: "/blocked" }, { status: 403 });
    }
    const sessionCheck = await checkOrCreateUserSession(session.userId);
    if (!sessionCheck.allowed) {
      return NextResponse.json({ blockReason: "session_limit" as const }, { status: 403 });
    }
  }

  const isPaidCourse = course.price != null && course.price > 0;
  const allowPreview = !isPaidCourse && !!currentLesson.isPreview;
  let canAccess = allowPreview;
  let enrollmentStatus: string | null = null;
  let hasPendingPayment = false;

  if (session && !canAccess) {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
      .limit(1);
    if (enrollment) {
      enrollmentStatus = (enrollment as { status?: string }).status ?? "approved";
      canAccess = enrollmentStatus === "approved";
    } else {
      const [pendingReq] = await db
        .select()
        .from(paymentRequests)
        .where(
          and(
            eq(paymentRequests.userId, session.userId),
            eq(paymentRequests.courseId, courseId)
          )
        )
        .orderBy(desc(paymentRequests.createdAt))
        .limit(1);
      hasPendingPayment = !!pendingReq && pendingReq.status === "pending";
    }
  }

  if (session && enrollmentStatus === "pending") {
    return NextResponse.json({ blockReason: "pending_approval" as const }, { status: 403 });
  }
  if (session && enrollmentStatus === "rejected") {
    return NextResponse.json({ redirectTo: `/courses/${courseId}?message=rejected` }, { status: 403 });
  }
  if (!canAccess) {
    if (session && hasPendingPayment) {
      return NextResponse.json({ redirectTo: `/courses/${courseId}?pending=1` }, { status: 403 });
    }
    if (session && isPaidCourse) {
      return NextResponse.json({ redirectTo: `/courses/${courseId}/checkout?message=request` }, { status: 403 });
    }
    return NextResponse.json({ redirectTo: `/courses/${courseId}?message=enroll` }, { status: 403 });
  }

  if (session && !allowPreview) {
    await markLessonComplete(session.userId, lessonIdNum);
  }

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const videoEmbed = getVideoEmbed(currentLesson.videoUrl);
  const embedUrl = videoEmbed?.embedUrl ?? null;
  const progressPercent =
    allLessons.length > 0 ? Math.round(((currentIndex + 1) / allLessons.length) * 100) : 0;

  const [resources, courseResourcesList] = await Promise.all([
    db.select().from(lessonResources).where(eq(lessonResources.lessonId, lessonIdNum)),
    db.select().from(courseResources).where(eq(courseResources.courseId, courseId)),
  ]);

  return NextResponse.json({
    course,
    allLessons,
    currentLesson,
    currentIndex,
    prevLesson,
    nextLesson,
    embedUrl,
    progressPercent,
    resources,
    courseResources: courseResourcesList,
  });
}
