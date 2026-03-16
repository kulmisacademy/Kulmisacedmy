"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews } from "@/lib/schema";

export async function approveReview(reviewId: number) {
  await db.update(reviews).set({ status: "approved" }).where(eq(reviews.id, reviewId));
  redirect("/admin/dashboard/reviews");
}

export async function rejectReview(reviewId: number) {
  await db.update(reviews).set({ status: "rejected" }).where(eq(reviews.id, reviewId));
  redirect("/admin/dashboard/reviews");
}

export async function deleteReview(reviewId: number) {
  await db.delete(reviews).where(eq(reviews.id, reviewId));
  redirect("/admin/dashboard/reviews");
}
