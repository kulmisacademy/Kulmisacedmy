"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, lessonResources, courseResources } from "@/lib/schema";
import { saveCourseThumbnailLocal, uploadCourseThumbnail, uploadLessonResource, saveCourseResourceLocal, uploadCourseResource } from "@/lib/upload";

export type CreateCourseState = { error?: string } | null;

/** Returns thumbnail path from uploaded file only. If no file uploaded, returns existing (edit) or null (create). Ignores Thumbnail URL field. */
async function getThumbnailFromForm(
  formData: FormData,
  existing: string | null = null
): Promise<string | null> {
  const file = formData.get("thumbnailFile");
  if (file instanceof File && file.size > 0) {
    const pathOrUrl = await saveCourseThumbnailLocal(file);
    if (pathOrUrl) return pathOrUrl;
    const blobUrl = await uploadCourseThumbnail(file);
    if (blobUrl) return blobUrl;
  }
  return existing;
}

export async function createCourse(
  _prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() || null;
  const thumbnail = await getThumbnailFromForm(formData);
  const priceRaw = formData.get("price")?.toString()?.trim();
  const instructorName = formData.get("instructorName")?.toString()?.trim() || null;
  const learningOutcomes = formData.get("learningOutcomes")?.toString()?.trim() || null;
  const categoryIdRaw = formData.get("categoryId")?.toString()?.trim();

  if (!title) return { error: "Title is required." };

  const price = priceRaw ? parseInt(priceRaw, 10) : 0;
  const priceFinal = isNaN(price) || price < 0 ? 0 : price;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
  const categoryIdFinal = categoryId != null && !isNaN(categoryId) && categoryId > 0 ? categoryId : null;

  try {
    await db.insert(courses).values({
      title,
      description,
      thumbnail: thumbnail || null,
      price: priceFinal,
      instructorName,
      learningOutcomes,
      categoryId: categoryIdFinal,
    });
  } catch (err) {
    console.error(err);
    return { error: "Failed to create course. Please try again." };
  }

  redirect("/admin/dashboard/courses");
}

export async function updateCourse(
  courseId: number,
  _prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() || null;
  const priceRaw = formData.get("price")?.toString()?.trim();
  const instructorName = formData.get("instructorName")?.toString()?.trim() || null;
  const learningOutcomes = formData.get("learningOutcomes")?.toString()?.trim() || null;
  const categoryIdRaw = formData.get("categoryId")?.toString()?.trim();

  if (!title) return { error: "Title is required." };

  const price = priceRaw ? parseInt(priceRaw, 10) : 0;
  const priceFinal = isNaN(price) || price < 0 ? 0 : price;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
  const categoryIdFinal = categoryId != null && !isNaN(categoryId) && categoryId > 0 ? categoryId : null;

  const [existing] = await db.select({ thumbnail: courses.thumbnail }).from(courses).where(eq(courses.id, courseId)).limit(1);
  const thumbnail = await getThumbnailFromForm(formData, existing?.thumbnail ?? null);

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
    console.error(err);
    return { error: "Failed to update course. Please try again." };
  }

  redirect("/admin/dashboard/courses");
}

export async function deleteCourse(formData: FormData) {
  const courseIdRaw = formData.get("courseId");
  const courseId = typeof courseIdRaw === "string" ? parseInt(courseIdRaw, 10) : null;
  if (courseId == null || isNaN(courseId)) return;
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/admin/dashboard/courses");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard/courses");
}

export async function addLesson(
  courseId: number,
  _prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() || null;
  const videoUrl = formData.get("videoUrl")?.toString()?.trim() || null;
  const durationRaw = formData.get("duration")?.toString()?.trim();
  const orderRaw = formData.get("lessonOrder")?.toString()?.trim();
  const isPreview = formData.get("isPreview") === "on";

  if (!title) return { error: "Lesson title is required." };

  const duration = durationRaw ? parseInt(durationRaw, 10) : null;
  const lessonOrder = orderRaw ? parseInt(orderRaw, 10) : 0;

  const existing = await db.select({ lessonOrder: lessons.lessonOrder }).from(lessons).where(eq(lessons.courseId, courseId));
  const nextOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.lessonOrder)) + 1 : 0;
  const order = orderRaw && lessonOrder >= 0 ? lessonOrder : nextOrder;

  try {
await db.insert(lessons).values({
    courseId,
    title,
    description,
    videoUrl: videoUrl || null,
    lessonOrder: order,
    duration: isNaN(duration as number) ? null : duration,
    isPreview,
  });
  } catch (err) {
    console.error(err);
    return { error: "Failed to add lesson. Please try again." };
  }
  revalidatePath(`/admin/dashboard/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/admin/dashboard/courses/${courseId}`);
}

export async function updateLesson(
  lessonId: number,
  courseId: number,
  _prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() || null;
  const videoUrl = formData.get("videoUrl")?.toString()?.trim() || null;
  const durationRaw = formData.get("duration")?.toString()?.trim();
  const orderRaw = formData.get("lessonOrder")?.toString()?.trim();
  const isPreview = formData.get("isPreview") === "on";

  if (!title) return { error: "Lesson title is required." };

  const duration = durationRaw ? parseInt(durationRaw, 10) : null;
  const lessonOrder = orderRaw ? parseInt(orderRaw, 10) : undefined;

  try {
    const payload: {
      title: string;
      description: string | null;
      videoUrl: string | null;
      duration: number | null;
      isPreview: boolean;
      lessonOrder?: number;
    } = {
      title,
      description,
      videoUrl: videoUrl || null,
      duration: isNaN(duration as number) ? null : duration,
      isPreview,
    };
    if (lessonOrder !== undefined && lessonOrder >= 0) {
      payload.lessonOrder = lessonOrder;
    }
    await db.update(lessons).set(payload).where(eq(lessons.id, lessonId));
  } catch (err) {
    console.error(err);
    return { error: "Failed to update lesson. Please try again." };
  }
  revalidatePath(`/admin/dashboard/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/admin/dashboard/courses/${courseId}`);
}

export async function updateLessonOrder(lessonId: number, newOrder: number) {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return;
  const all = await db.select().from(lessons).where(eq(lessons.courseId, lesson.courseId)).orderBy(asc(lessons.lessonOrder));
  const fromIdx = all.findIndex((l) => l.id === lessonId);
  if (fromIdx < 0) return;
  const toIdx = Math.max(0, Math.min(newOrder, all.length - 1));
  if (fromIdx === toIdx) return;
  const reordered = [...all];
  const [removed] = reordered.splice(fromIdx, 1);
  reordered.splice(toIdx, 0, removed);
  for (let i = 0; i < reordered.length; i++) {
    await db.update(lessons).set({ lessonOrder: i }).where(eq(lessons.id, reordered[i].id));
  }
  revalidatePath(`/admin/dashboard/courses/${lesson.courseId}`);
  revalidatePath(`/courses/${lesson.courseId}`);
  redirect(`/admin/dashboard/courses/${lesson.courseId}`);
}

export async function deleteLesson(lessonId: number, courseId: number) {
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  revalidatePath(`/admin/dashboard/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/admin/dashboard/courses/${courseId}`);
}

export type AddResourceState = { error?: string } | null;

export async function addLessonResource(
  lessonId: number,
  courseId: number,
  _prevState: AddResourceState,
  formData: FormData
): Promise<AddResourceState> {
  const title = formData.get("resourceTitle")?.toString()?.trim();
  const resourceType = formData.get("resourceType")?.toString()?.trim(); // 'file' | 'link'
  const file = formData.get("resourceFile") instanceof File ? formData.get("resourceFile") as File : null;
  const resourceUrl = formData.get("resourceUrl")?.toString()?.trim();

  if (!title) return { error: "Resource title is required." };
  if (resourceType !== "file" && resourceType !== "link") return { error: "Select file or link." };

  let fileUrl: string | null = null;
  if (resourceType === "file" && file && file.size > 0) {
    fileUrl = await uploadLessonResource(file);
    if (!fileUrl) {
      return {
        error:
          "File upload failed. Use allowed types (PDF, ZIP, images, text, etc.) and max 10MB. On Vercel: add BLOB_READ_WRITE_TOKEN in Settings → Environment Variables, then redeploy.",
      };
    }
  } else if (resourceType === "link" && resourceUrl) {
    fileUrl = resourceUrl;
  }
  if (!fileUrl) return { error: "Provide a file upload or resource URL." };

  try {
    await db.insert(lessonResources).values({
      lessonId,
      title,
      resourceType,
      fileUrl,
    });
  } catch (err) {
    console.error(err);
    return { error: "Failed to add resource." };
  }
  redirect(`/admin/dashboard/courses/${courseId}/lessons/${lessonId}/edit`);
}

export async function deleteLessonResource(resourceId: number, lessonId: number, courseId: number) {
  await db.delete(lessonResources).where(eq(lessonResources.id, resourceId));
  redirect(`/admin/dashboard/courses/${courseId}/lessons/${lessonId}/edit`);
}

// ——— Course Resources (course-level downloadable files) ———

export type AddCourseResourceState = { error?: string } | null;

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function addCourseResource(
  courseId: number,
  _prevState: AddCourseResourceState,
  formData: FormData
): Promise<AddCourseResourceState> {
  const title = formData.get("resourceTitle")?.toString()?.trim();
  const description = formData.get("resourceDescription")?.toString()?.trim() || null;
  const resourceUrl = formData.get("resourceUrl")?.toString()?.trim() || "";
  const file = formData.get("resourceFile") instanceof File ? (formData.get("resourceFile") as File) : null;

  if (!title) return { error: "Resource title is required." };

  let fileUrl: string;
  if (resourceUrl && isHttpUrl(resourceUrl)) {
    fileUrl = resourceUrl;
  } else if (file && file.size > 0) {
    fileUrl = (await saveCourseResourceLocal(file)) ?? (await uploadCourseResource(file)) ?? "";
    if (!fileUrl) {
      return {
        error:
          "File upload failed. Allowed: ZIP, PDF, DOCX, XLSX, PPTX, TXT. Max 100MB. On Vercel: add BLOB_READ_WRITE_TOKEN in Settings → Environment Variables, then redeploy.",
      };
    }
  } else {
    return { error: "Provide either a resource URL (link) or upload a file." };
  }

  try {
    await db.insert(courseResources).values({
      courseId,
      title,
      fileUrl,
      description,
    });
    revalidatePath(`/admin/dashboard/courses/${courseId}/edit`);
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/lessons/[lessonId]`);
  } catch (err) {
    console.error(err);
    return { error: "Failed to add resource." };
  }
  redirect(`/admin/dashboard/courses/${courseId}/edit`);
}

export async function deleteCourseResource(formData: FormData) {
  const idRaw = formData.get("resourceId")?.toString();
  const courseIdRaw = formData.get("courseId")?.toString();
  const resourceId = idRaw ? parseInt(idRaw, 10) : NaN;
  const courseId = courseIdRaw ? parseInt(courseIdRaw, 10) : NaN;
  if (isNaN(resourceId) || isNaN(courseId)) return;
  await db.delete(courseResources).where(eq(courseResources.id, resourceId));
  redirect(`/admin/dashboard/courses/${courseId}/edit`);
}
