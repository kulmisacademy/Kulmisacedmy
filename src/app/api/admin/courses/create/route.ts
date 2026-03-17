import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { saveCourseThumbnailLocal, uploadCourseThumbnail, uploadCourseThumbnailImageKit } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/dashboard/courses/new?error=upload", request.url)
    );
  }

  const title = formData.get("title")?.toString()?.trim();
  if (!title) {
    return NextResponse.redirect(
      new URL("/admin/dashboard/courses/new?error=title", request.url)
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

  let thumbnail: string | null = null;
  let thumbnailFailed = false;
  let thumbnailErrorCode: "no_token" | "upload_failed" | "thumbnail_imagekit" | null = null;
  const file = formData.get("thumbnailFile");
  if (file instanceof File && file.size > 0) {
    const hasImageKit = Boolean(process.env.IMAGEKIT_PRIVATE_KEY?.trim());
    const isVercel = process.env.VERCEL === "1";
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

    let url: string | null = null;
    if (hasImageKit) url = await uploadCourseThumbnailImageKit(file);
    if (!url) {
      const localPath = await saveCourseThumbnailLocal(file);
      if (localPath) url = localPath;
    }
    if (!url && hasBlobToken) url = await uploadCourseThumbnail(file);

    if (url) thumbnail = url;
    else {
      thumbnailFailed = true;
      if (hasImageKit) thumbnailErrorCode = "thumbnail_imagekit";
      else if (isVercel && !hasBlobToken) thumbnailErrorCode = "no_token";
      else thumbnailErrorCode = "upload_failed";
    }
  }

  try {
    await db.insert(courses).values({
      title,
      description,
      thumbnail,
      price: priceFinal,
      instructorName,
      learningOutcomes,
      categoryId: categoryIdFinal,
    });
  } catch (err) {
    console.error("Course create failed:", err);
    return NextResponse.redirect(
      new URL("/admin/dashboard/courses/new?error=save", request.url)
    );
  }

  revalidatePath("/courses");
  revalidatePath("/admin/dashboard/courses");

  if (thumbnailFailed) {
    return NextResponse.redirect(
      new URL("/admin/dashboard/courses?created=1&warning=thumbnail", request.url)
    );
  }
  return NextResponse.redirect(new URL("/admin/dashboard/courses", request.url));
}
