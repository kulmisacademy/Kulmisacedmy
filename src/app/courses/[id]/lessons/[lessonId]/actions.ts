"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { progress } from "@/lib/schema";

export async function markLessonComplete(userId: number, lessonId: number) {
  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)))
    .limit(1);
  if (existing.length) {
    await db
      .update(progress)
      .set({ completed: true })
      .where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)));
  } else {
    await db.insert(progress).values({ userId, lessonId, completed: true });
  }
}
