"use server";

import { put } from "@vercel/blob";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg", "image/x-png"];
const UPLOAD_DIR = "public/uploads/courses";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/x-png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Save course thumbnail to local public/uploads/courses/ and return the public path.
 * Works when running locally (e.g. npm run dev / Node server).
 * On Vercel the filesystem is read-only; use BLOB_READ_WRITE_TOKEN for production.
 */
const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function isAllowedImage(file: File): boolean {
  const extFromName = path.extname(file.name).slice(1).toLowerCase();
  if (extFromName && IMAGE_EXT.has(extFromName)) return true;
  if (IMAGE_TYPES.includes(file.type)) return true;
  if (file.type.startsWith("image/")) return true;
  return false;
}

export async function saveCourseThumbnailLocal(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_SIZE) return null;
  if (!isAllowedImage(file)) return null;

  try {
    const extFromName = path.extname(file.name).slice(1).toLowerCase();
    const ext = EXT_BY_TYPE[file.type] ?? (extFromName && IMAGE_EXT.has(extFromName) ? extFromName : "jpg");
    const name = `course-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    return `/uploads/courses/${name}`;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[upload] saveCourseThumbnailLocal failed:", err);
    }
    return null;
  }
}

/**
 * Upload a course thumbnail to ImageKit.io.
 * Requires IMAGEKIT_PRIVATE_KEY (and optionally IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT for older SDK) in env.
 * Returns the public image URL or null.
 */
export async function uploadCourseThumbnailImageKit(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_SIZE) return null;
  if (!isAllowedImage(file)) return null;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  if (!privateKey) {
    console.error("[upload] IMAGEKIT_PRIVATE_KEY is not set or empty");
    return null;
  }

  try {
    const buffer = await file.arrayBuffer();
    const ext = (EXT_BY_TYPE[file.type] ?? path.extname(file.name).slice(1)) || "jpg";
    const baseName = (file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "") || "image";
    const fileName = `${Date.now()}-${baseName}.${ext}`;
    const fileForUpload = await toFile(buffer, fileName, {
      type: file.type || "image/jpeg",
    });
    const imagekit = new ImageKit({ privateKey });
    const res = await imagekit.files.upload({
      file: fileForUpload,
      fileName,
      folder: "courses",
    }) as { url?: string; filePath?: string };
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
    const url = res.url ?? (urlEndpoint && res.filePath
      ? `${urlEndpoint.replace(/\/$/, "")}${res.filePath}`
      : null);
    return url ?? null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] ImageKit upload failed:", msg);
    return null;
  }
}

const RESOURCE_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/html",
  "application/json",
  "application/javascript",
  "text/css",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
];

/**
 * Upload a course thumbnail to Vercel Blob.
 * Requires BLOB_READ_WRITE_TOKEN in env. Returns null if not configured or invalid file.
 */
export async function uploadCourseThumbnail(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_SIZE) return null;
  if (!isAllowedImage(file)) return null;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    console.error("[upload] BLOB_READ_WRITE_TOKEN is not set or empty");
    return null;
  }

  try {
    // Use ArrayBuffer so upload works reliably in Vercel serverless (File can be unreliable there)
    const buffer = await file.arrayBuffer();
    const pathname = `courses/${Date.now()}-${(file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      token,
      contentType: file.type || "image/jpeg",
    });
    return blob.url;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] Vercel Blob upload failed:", msg);
    return null;
  }
}

const RESOURCE_MAX_SIZE = 10 * 1024 * 1024; // 10 MB for lesson resources
const LESSON_RESOURCE_DIR = "public/uploads/lesson-resources";

const RESOURCE_EXT_BY_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "text/plain": "txt",
  "text/html": "html",
  "application/json": "json",
  "application/javascript": "js",
  "text/css": "css",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/msword": "doc",
  "application/vnd.ms-excel": "xls",
  "application/vnd.ms-powerpoint": "ppt",
};

const LESSON_RESOURCE_ALLOWED_EXT = new Set([
  "pdf", "zip", "txt", "html", "json", "js", "css", "jpg", "jpeg", "png", "webp", "gif",
  "doc", "docx", "xls", "xlsx", "ppt", "pptx",
]);

/**
 * Save a lesson resource file locally. Same types as uploadLessonResource. Max 10MB.
 * Accepts by MIME type or by file extension (for when browser sends generic/unknown MIME).
 * Returns path like /uploads/lesson-resources/les-1234567890-abc12.pdf for DB.
 */
export async function saveLessonResourceLocal(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > RESOURCE_MAX_SIZE) return null;

  const extFromName = path.extname(file.name).slice(1).toLowerCase();
  const extFromMime = RESOURCE_EXT_BY_TYPE[file.type];
  const allowedByMime = RESOURCE_TYPES.includes(file.type);
  const allowedByExt = extFromName && LESSON_RESOURCE_ALLOWED_EXT.has(extFromName);
  if (!allowedByMime && !allowedByExt) return null;

  try {
    const ext = extFromMime ?? (extFromName || "bin");
    const name = `les-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const dir = path.join(process.cwd(), LESSON_RESOURCE_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    return `/uploads/lesson-resources/${name}`;
  } catch {
    return null;
  }
}

// Course resources: zip, pdf, docx, xlsx, pptx, txt — max 100MB
const COURSE_RESOURCE_MAX_SIZE = 100 * 1024 * 1024; // 100 MB
const COURSE_RESOURCE_DIR = "public/uploads/course-resources";
const COURSE_RESOURCE_TYPES: Record<string, string> = {
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "text/plain": "txt",
};

/**
 * Save a course resource file locally. Allowed: zip, pdf, docx, xlsx, pptx, txt. Max 100MB.
 * Returns path like /uploads/course-resources/res-1234567890-abc12.zip for DB.
 */
export async function saveCourseResourceLocal(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > COURSE_RESOURCE_MAX_SIZE) return null;
  const ext = COURSE_RESOURCE_TYPES[file.type] ?? path.extname(file.name).slice(1).toLowerCase();
  const allowed = new Set(Object.values(COURSE_RESOURCE_TYPES));
  if (!ext || !allowed.has(ext)) return null;

  try {
    const name = `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const dir = path.join(process.cwd(), COURSE_RESOURCE_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    return `/uploads/course-resources/${name}`;
  } catch {
    return null;
  }
}

/**
 * Upload course resource to Vercel Blob when local save fails (e.g. on Vercel). Same types/size as saveCourseResourceLocal.
 */
export async function uploadCourseResource(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > COURSE_RESOURCE_MAX_SIZE) return null;
  const ext = COURSE_RESOURCE_TYPES[file.type] ?? path.extname(file.name).slice(1).toLowerCase();
  const allowed = new Set(Object.values(COURSE_RESOURCE_TYPES));
  if (!ext || !allowed.has(ext)) return null;

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;
  try {
    const buffer = await file.arrayBuffer();
    const pathname = `course-resources/${Date.now()}-${(file.name || "file").replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      token,
      contentType: file.type || "application/octet-stream",
    });
    return blob.url;
  } catch {
    return null;
  }
}

/**
 * Upload lesson resource: tries local save first (works without BLOB token), then Vercel Blob.
 * Accepts by MIME type or by file extension (same as saveLessonResourceLocal).
 */
export async function uploadLessonResource(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > RESOURCE_MAX_SIZE) return null;

  const extFromName = path.extname(file.name).slice(1).toLowerCase();
  const allowedByMime = RESOURCE_TYPES.includes(file.type);
  const allowedByExt = extFromName && LESSON_RESOURCE_ALLOWED_EXT.has(extFromName);
  if (!allowedByMime && !allowedByExt) return null;

  const local = await saveLessonResourceLocal(file);
  if (local) return local;

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;
  try {
    const buffer = await file.arrayBuffer();
    const pathname = `resources/${Date.now()}-${(file.name || "file").replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      token,
      contentType: file.type || "application/octet-stream",
    });
    return blob.url;
  } catch {
    return null;
  }
}
