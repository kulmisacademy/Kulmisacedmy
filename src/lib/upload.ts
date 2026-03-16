"use server";

import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const UPLOAD_DIR = "public/uploads/courses";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Save course thumbnail to local public/uploads/courses/ and return the public path.
 * Works when running locally (e.g. npm run dev / Node server).
 * Returns path like /uploads/courses/course-1234567890-abc12.jpg for storing in DB.
 */
export async function saveCourseThumbnailLocal(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_SIZE) return null;
  if (!IMAGE_TYPES.includes(file.type)) return null;

  try {
    const ext = EXT_BY_TYPE[file.type] ?? (path.extname(file.name).slice(1) || "jpg");
    const name = `course-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    return `/uploads/courses/${name}`;
  } catch {
    return null;
  }
}
const RESOURCE_TYPES = [
  "application/pdf",
  "application/zip",
  "text/plain",
  "text/html",
  "application/json",
  "application/javascript",
  "text/css",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
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
  if (!IMAGE_TYPES.includes(file.type)) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const blob = await put(`courses/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return blob.url;
  } catch {
    return null;
  }
}

const RESOURCE_MAX_SIZE = 10 * 1024 * 1024; // 10 MB for resources

export async function uploadLessonResource(
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > RESOURCE_MAX_SIZE) return null;
  if (!RESOURCE_TYPES.includes(file.type)) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const blob = await put(`resources/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return blob.url;
  } catch {
    return null;
  }
}
