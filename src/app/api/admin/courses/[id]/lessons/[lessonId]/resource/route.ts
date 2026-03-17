import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, lessonResources } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { uploadLessonResource } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id: courseIdParam, lessonId: lessonIdParam } = await params;
  const courseId = parseInt(courseIdParam, 10);
  const lessonId = parseInt(lessonIdParam, 10);
  if (isNaN(courseId) || isNaN(lessonId)) {
    return NextResponse.redirect(new URL("/admin/dashboard/courses", request.url));
  }

  const editUrl = new URL(
    `/admin/dashboard/courses/${courseId}/lessons/${lessonId}/edit`,
    request.url
  );

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    editUrl.searchParams.set("error", "resource_upload");
    return NextResponse.redirect(editUrl);
  }

  const title = formData.get("resourceTitle")?.toString()?.trim();
  const resourceType = formData.get("resourceType")?.toString()?.trim();
  const file = formData.get("resourceFile");
  const resourceUrl = formData.get("resourceUrl")?.toString()?.trim();

  if (!title) {
    editUrl.searchParams.set("error", "resource_title");
    return NextResponse.redirect(editUrl);
  }
  if (resourceType !== "file" && resourceType !== "link") {
    editUrl.searchParams.set("error", "resource_type");
    return NextResponse.redirect(editUrl);
  }

  let fileUrl: string | null = null;
  if (resourceType === "file" && file instanceof File && file.size > 0) {
    fileUrl = await uploadLessonResource(file);
    if (!fileUrl) {
      editUrl.searchParams.set("error", "resource_upload");
      return NextResponse.redirect(editUrl);
    }
  } else if (resourceType === "link" && resourceUrl) {
    fileUrl = resourceUrl;
  }

  if (!fileUrl) {
    editUrl.searchParams.set("error", "resource_missing");
    return NextResponse.redirect(editUrl);
  }

  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);
  if (!lesson || lesson.courseId !== courseId) {
    return NextResponse.redirect(new URL("/admin/dashboard/courses", request.url));
  }

  try {
    await db.insert(lessonResources).values({
      lessonId,
      title,
      resourceType: resourceType as "file" | "link",
      fileUrl,
    });
  } catch (err) {
    console.error("Lesson resource insert failed:", err);
    editUrl.searchParams.set("error", "resource_save");
    return NextResponse.redirect(editUrl);
  }

  return NextResponse.redirect(editUrl.toString());
}
