"use server";

import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import { clearUserSessionOnLogout } from "@/lib/session-access";

export async function signOut() {
  const session = await getSession();
  if (session) await clearUserSessionOnLogout(session.userId);
  await clearSession();
  redirect("/");
}
