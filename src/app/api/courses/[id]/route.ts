import { NextResponse } from "next/server";
import { eq, asc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  courses,
  lessons,
  enrollments,
  users,
  reviews,
  courseResources,
  paymentRequests,
} from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
  }

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) {
    return NextResponse.json(null, { status: 404 });
  }

  const session = await getSession();
  let isEnrolled = false;
  let userPhone: string | null = null;
  let hasPendingPayment = false;
  if (session) {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
      .limit(1);
    const enrollmentStatus = (enrollment as { status?: string } | undefined)?.status ?? "approved";
    isEnrolled = !!enrollment && enrollmentStatus === "approved";
    const [pendingReq] = await db
      .select()
      .from(paymentRequests)
      .where(
        and(
          eq(paymentRequests.userId, session.userId),
          eq(paymentRequests.courseId, courseId)
        )
      )
      .limit(1);
    hasPendingPayment = !!pendingReq && pendingReq.status === "pending";
    const [userRow] = await db
      .select({ phone: users.phone })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    userPhone = userRow?.phone ?? null;
  }

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.lessonOrder));

  const [approvedReviews, resourcesList] = await Promise.all([
    db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        courseId: reviews.courseId,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        status: reviews.status,
        createdAt: reviews.createdAt,
        userName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.courseId, courseId), eq(reviews.status, "approved"))),
    db.select().from(courseResources).where(eq(courseResources.courseId, courseId)),
  ]);

  return NextResponse.json({
    course,
    lessons: courseLessons,
    isEnrolled,
    userPhone,
    hasPendingPayment,
    session: session
      ? { userId: session.userId, email: session.email, name: session.name, role: session.role }
      : null,
    reviews: approvedReviews,
    resources: resourcesList,
  });
}
