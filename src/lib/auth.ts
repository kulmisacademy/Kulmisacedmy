import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "session";
const ADMIN_COOKIE_NAME = "admin_session"; // legacy, keep for backward compat
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-in-production-32ch";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export type SessionUser = { userId: number; email: string; name: string; role: string };

export function createSession(user: { id: number; email: string; name: string; role: string }) {
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!raw) return null;
  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature || !verify(encoded, signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name ?? payload.email,
      role: payload.role ?? "student",
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

// ——— Admin ———
export async function getAdminSession(): Promise<{ email: string; name?: string } | null> {
  const s = await getSession();
  return s?.role === "admin" ? { email: s.email, name: s.name } : null;
}
