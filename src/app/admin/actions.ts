"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession, setSessionCookie, clearSession } from "@/lib/auth";

export async function login(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email")?.toString()?.trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || user.role !== "admin") {
    return { error: "Invalid email or password." };
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return { error: "Invalid email or password." };
  }

  const session = createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(session);
  redirect("/admin/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/admin");
}
