import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { saveCourseThumbnailLocal, uploadCourseThumbnail } from "@/lib/upload";

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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(
      new URL(`/admin/dashboard/courses/${courseId}/edit?error=upload`, request.url)
    );
  }

  const title = formData.get("title")?.toString()?.trim();
  if (!title) {
    return NextResponse.redirect(
      new URL(`/admin/dashboard/courses/${courseId}/edit?error=title`, request.url)
    );
  }

  const description = formData.get("description")?.toString()?.trim() || null;
  const instructorName = formData.get("instructorName")?.toString()?.trim() || null;
  const learningOutcomes = formData.get("learningOutcomes")?.toString()?.trim() || null;
  const priceRaw = formData.get("price")?.toString()?.trim();
  const categoryIdRaw = formData.get("categoryId")?.toString()?.trim();

  const price = priceRaw ? parseInt(priceRaw, 10) : 0;
  const priceFinal = isNaN(price) || price < 0 ? 0 : price;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
  const categoryIdFinal =
    categoryId != null && !isNaN(categoryId) && categoryId > 0 ? categoryId : null;

  const [existing] = await db
    .select({ thumbnail: courses.thumbnail })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  const existingThumbnail = existing?.thumbnail ?? null;
  let thumbnail: string | null = existingThumbnail;

  let thumbnailFailed = false;
  const file = formData.get("thumbnailFile");
  if (file instanceof File && file.size > 0) {
    const isVercel = process.env.VERCEL === "1";
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
    if (process.env.VERCEL === "1") {
      console.log("[course-update] Vercel env, BLOB_READ_WRITE_TOKEN present:", hasBlobToken);
    }
    if (isVercel && hasBlobToken) {
      const blobUrl = await uploadCourseThumbnail(file);
      if (blobUrl) thumbnail = blobUrl;
      else thumbnailFailed = true;
    } else {
      const localPath = await saveCourseThumbnailLocal(file);
      if (localPath) {
        thumbnail = localPath;
      } else {
        const blobUrl = await uploadCourseThumbnail(file);
        if (blobUrl) thumbnail = blobUrl;
        else thumbnailFailed = true;
      }
    }
  }

  try {
    await db
      .update(courses)
      .set({
        title,
        description,
        thumbnail,
        price: priceFinal,
        instructorName,
        learningOutcomes,
        categoryId: categoryIdFinal,
      })
      .where(eq(courses.id, courseId));
  } catch (err) {
    console.error("Course update failed:", err);
    return NextResponse.redirect(
      new URL(`/admin/dashboard/courses/${courseId}/edit?error=save`, request.url)
    );
  }

  const base = new URL("/admin/dashboard/courses", request.url);
  if (thumbnailFailed) {
    return NextResponse.redirect(
      new URL(`/admin/dashboard/courses/${courseId}/edit?error=thumbnail`, request.url)
    );
  }
  return NextResponse.redirect(base.toString());
}
