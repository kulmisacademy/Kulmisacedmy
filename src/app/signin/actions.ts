"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession, setSessionCookie } from "@/lib/auth";

export type SignInState = { error?: string } | null;

export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const password = formData.get("password")?.toString();
  const returnTo = formData.get("returnTo")?.toString()?.trim() || "/";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
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

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  }
  redirect(returnTo);
}
