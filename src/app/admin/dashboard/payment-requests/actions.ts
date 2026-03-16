"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentRequests, enrollments } from "@/lib/schema";

export async function approvePaymentRequest(requestId: number) {
  const [req] = await db.select().from(paymentRequests).where(eq(paymentRequests.id, requestId)).limit(1);
  if (!req || req.status !== "pending") return;
  await db.update(paymentRequests).set({ status: "approved" }).where(eq(paymentRequests.id, requestId));
  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, req.userId), eq(enrollments.courseId, req.courseId)))
    .limit(1);
  if (!existing) {
    await db.insert(enrollments).values({ userId: req.userId, courseId: req.courseId });
  }
  revalidatePath("/admin/dashboard/payment-requests");
}

export async function rejectPaymentRequest(requestId: number) {
  await db.update(paymentRequests).set({ status: "rejected" }).where(eq(paymentRequests.id, requestId));
  revalidatePath("/admin/dashboard/payment-requests");
}
