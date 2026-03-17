"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, paymentRequests, courses, reviews } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export type EnrollFreeResult = { ok: true; redirectTo: string } | { ok: false; redirectTo: string } | { ok: false; error: string };

export async function enrollFreeCourse(courseId: number): Promise<EnrollFreeResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, redirectTo: `/register?returnTo=${encodeURIComponent(`/courses/${courseId}`)}` };
  }
  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  if (existing) {
    return { ok: true, redirectTo: `/courses/${courseId}` };
  }
  await db.insert(enrollments).values({ userId: session.userId, courseId, status: "approved" });
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);
  return { ok: true, redirectTo: `/courses/${courseId}` };
}

export type SubmitPaymentState = { error?: string; success?: boolean } | null;

export async function submitPaymentRequest(
  _prevState: SubmitPaymentState,
  formData: FormData
): Promise<SubmitPaymentState> {
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to submit a payment request." };
  }
  const courseIdRaw = formData.get("courseId")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const note = formData.get("note")?.toString()?.trim() || null;

  const courseId = courseIdRaw ? parseInt(courseIdRaw, 10) : 0;
  if (!courseId || !name || !phone) {
    return { error: "Name and phone are required." };
  }

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) {
    return { error: "Course not found. Please refresh the page and try again." };
  }

  try {
    await db.insert(paymentRequests).values({
      userId: session.userId,
      courseId,
      name,
      phone,
      note,
      status: "pending",
    });
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Payment request insert failed:", err);
    return { error: "Failed to submit. Please try again." };
  }
}

export type SubmitReviewState = { error?: string; success?: boolean } | null;

export async function submitCourseReview(
  courseId: number,
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const session = await getSession();
  if (!session) return { error: "You must be signed in to submit a review." };

  const ratingRaw = formData.get("rating")?.toString();
  const reviewText = formData.get("reviewText")?.toString()?.trim();
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : 0;
  if (!reviewText || rating < 1 || rating > 5) {
    return { error: "Please select a rating (1–5) and write your review." };
  }

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  const status = (enrollment as { status?: string } | undefined)?.status;
  if (!enrollment || status !== "approved") {
    return { error: "You must be enrolled and approved in this course to submit a review." };
  }

  const [existing] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, session.userId), eq(reviews.courseId, courseId)))
    .limit(1);
  if (existing) return { error: "You have already submitted a review for this course." };

  try {
    await db.insert(reviews).values({
      userId: session.userId,
      courseId,
      rating,
      reviewText,
      status: "pending",
    });
    return { success: true };
  } catch (err) {
    console.error("Review insert failed:", err);
    return { error: "Failed to submit review. Please try again." };
  }
}
