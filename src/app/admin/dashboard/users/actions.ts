"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function updateUserStatus(_prev: unknown, formData: FormData) {
  const userIdRaw = formData.get("userId")?.toString();
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
  const status = formData.get("status") as string | null;
  if (isNaN(userId) || !status || !["active", "pending", "blocked"].includes(status)) return;
  await db.update(users).set({ status: status as "active" | "pending" | "blocked" }).where(eq(users.id, userId));
  redirect("/admin/dashboard/users");
}

export async function deleteUser(formData: FormData) {
  const idRaw = formData.get("userId")?.toString();
  const userId = idRaw ? parseInt(idRaw, 10) : null;
  if (userId == null || isNaN(userId)) return;
  await db.delete(users).where(eq(users.id, userId));
  redirect("/admin/dashboard/users");
}
