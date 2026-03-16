import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return NextResponse.redirect(new URL("/admin/dashboard/courses", request.url));
  }

  try {
    await db.delete(courses).where(eq(courses.id, courseId));
  } catch (err) {
    console.error("Delete course failed:", err);
    return NextResponse.redirect(
      new URL("/admin/dashboard/courses?error=delete", request.url)
    );
  }

  revalidatePath("/admin/dashboard/courses");
  revalidatePath("/admin/dashboard");

  return NextResponse.redirect(new URL("/admin/dashboard/courses", request.url));
}
