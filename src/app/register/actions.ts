"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession, setSessionCookie } from "@/lib/auth";
import { updateUserSessionOnLogin } from "@/lib/session-access";

export type RegisterState = { error?: string } | { success: true; redirectTo: string } | null;

export async function register(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const phone = formData.get("phone")?.toString()?.trim() || null;
  const password = formData.get("password")?.toString();
  const returnTo = formData.get("returnTo")?.toString()?.trim() || "/";

  const confirmPassword = formData.get("confirmPassword")?.toString();
  if (!name || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Password and confirm password do not match." };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const inserted = await db
    .insert(users)
    .values({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "student",
    })
    .returning();
  const user = inserted[0];

  if (!user) {
    return { error: "Registration failed. Please try again." };
  }

  const session = createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(session);
  await updateUserSessionOnLogin(user.id);
  revalidatePath("/dashboard");
  revalidatePath(returnTo);
  revalidatePath("/");
  return { success: true, redirectTo: returnTo };
}
