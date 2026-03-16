"use client";

import Link from "next/link";
import type { Category } from "@/lib/schema";

const ERROR_MESSAGES: Record<string, string> = {
  title: "Title is required.",
  upload: "Failed to read form. Please try again.",
  save: "Failed to save. Please try again.",
  thumbnail_no_token:
    "BLOB_READ_WRITE_TOKEN is not set. In Vercel: Project Settings → Environment Variables → add BLOB_READ_WRITE_TOKEN with the token value only (no quotes), then redeploy.",
  thumbnail_imagekit:
    "ImageKit upload failed. On Vercel: add IMAGEKIT_PRIVATE_KEY (and optionally IMAGEKIT_URL_ENDPOINT) in Settings → Environment Variables, then redeploy. Use JPEG, PNG, WebP or GIF under 4 MB. Check function logs for “[upload] ImageKit upload failed” for the exact error.",
  upload_failed:
    "Thumbnail upload failed. Use JPEG, PNG, WebP or GIF under 4 MB. On Vercel: add IMAGEKIT_PRIVATE_KEY or BLOB_READ_WRITE_TOKEN in Settings → Environment Variables, then redeploy. Check function logs for the exact error.",
  thumbnail:
    "Thumbnail upload failed. Use JPEG, PNG, WebP or GIF under 4 MB. On Vercel: add IMAGEKIT_PRIVATE_KEY for ImageKit, or BLOB_READ_WRITE_TOKEN for Vercel Blob, in Settings → Environment Variables, then redeploy. Check function logs for the exact error.",
};

export function CreateCourseForm({
  categories,
  errorParam,
}: {
  categories: Category[];
  errorParam?: string;
}) {
  const errorMessage = errorParam ? (ERROR_MESSAGES[errorParam] ?? `Something went wrong. (${errorParam})`) : null;

  return (
    <form
      action="/api/admin/courses/create"
      method="POST"
      encType="multipart/form-data"
      className="mt-6 space-y-6"
    >
      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={500}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. Mastering React & Next.js"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="What will students learn?"
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">— No category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700">
          Instructor name
        </label>
        <input
          id="instructorName"
          name="instructorName"
          type="text"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. Jane Smith"
        />
      </div>
      <div>
        <label htmlFor="learningOutcomes" className="block text-sm font-medium text-gray-700">
          What You Will Learn (one per line)
        </label>
        <textarea
          id="learningOutcomes"
          name="learningOutcomes"
          rows={5}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="Build modern websites&#10;Understand full stack development&#10;Learn practical coding skills"
        />
      </div>
      <div>
        <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-700">
          Course Thumbnail
        </label>
        <input
          id="thumbnailFile"
          name="thumbnailFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-200"
        />
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP or GIF. Max 4 MB.</p>
        <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">On Vercel: add BLOB_READ_WRITE_TOKEN (value only, no quotes) in Settings → Environment Variables, ensure a Blob store exists under Storage, then redeploy.</p>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          step={1}
          defaultValue={0}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="0"
        />
        <p className="mt-1 text-xs text-gray-500">Use 0 for free courses.</p>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Create course
        </button>
        <Link
          href="/admin/dashboard/courses"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
