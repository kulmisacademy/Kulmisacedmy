import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("session")?.value ?? request.cookies.get("admin_session")?.value;

  // Admin dashboard: require session
  if (path.startsWith("/admin/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Lesson routes: require session (enrollment checked in page)
  const lessonMatch = path.match(/^\/courses\/([^/]+)\/lessons\//);
  if (lessonMatch) {
    if (!sessionCookie) {
      const signin = new URL("/signin", request.url);
      signin.searchParams.set("returnTo", path);
      return NextResponse.redirect(signin);
    }
    return NextResponse.next();
  }

  // My Courses / dashboard: require session
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    if (!sessionCookie) {
      const signin = new URL("/signin", request.url);
      signin.searchParams.set("returnTo", "/dashboard");
      return NextResponse.redirect(signin);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/courses/:courseId/lessons/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
