import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userSessions } from "@/lib/schema";

/**
 * Call after login/register: set this device as the single active session.
 * Updates or inserts the user_sessions row so the current IP/device is allowed.
 */
export async function updateUserSessionOnLogin(userId: number): Promise<void> {
  const ip = await getClientIp();
  const device = await getClientDevice();
  await db
    .insert(userSessions)
    .values({ userId, ipAddress: ip, device })
    .onConflictDoUpdate({
      target: userSessions.userId,
      set: { ipAddress: ip, device },
    });
}

/**
 * Call on logout: remove the active session so the next login (any device) can take over.
 */
export async function clearUserSessionOnLogout(userId: number): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));
}

const DEVICE_MAX_LEN = 255;

/**
 * Get client IP from request headers (works behind proxy).
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const real = h.get("x-real-ip");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim() ?? "";
    if (first) return first;
  }
  if (real) return real;
  return "unknown";
}

/**
 * Get User-Agent for device/session info.
 */
export async function getClientDevice(): Promise<string> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return ua.slice(0, DEVICE_MAX_LEN);
}

export type SessionCheckResult =
  | { allowed: true }
  | { allowed: false; reason: "different_device" };

/**
 * Enforce one active session per user by IP.
 * - If no row for user: insert (current IP, device) and allow.
 * - If row exists and IP matches: allow.
 * - If row exists and IP differs: block (different device).
 */
export async function checkOrCreateUserSession(
  userId: number
): Promise<SessionCheckResult> {
  const ip = await getClientIp();
  const device = await getClientDevice();

  const [existing] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.userId, userId))
    .limit(1);

  if (!existing) {
    await db.insert(userSessions).values({
      userId,
      ipAddress: ip,
      device,
    });
    return { allowed: true };
  }

  if (existing.ipAddress !== ip) {
    return { allowed: false, reason: "different_device" };
  }

  return { allowed: true };
}
