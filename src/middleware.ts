import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin/dashboard")) return NextResponse.next();

  const sessionCookie = request.cookies.get("session")?.value ?? request.cookies.get("admin_session")?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/dashboard/:path*"] };
