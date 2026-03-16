"use client";

import Link from "next/link";
import type { Course, Category } from "@/lib/schema";

const ERROR_MESSAGES: Record<string, string> = {
  title: "Title is required.",
  upload: "Failed to read form. Please try again.",
  save: "Failed to save. Please try again.",
};

export function EditCourseForm({
  course,
  categories,
  errorParam,
}: {
  course: Course;
  categories: Category[];
  errorParam?: string;
}) {
  const errorMessage = errorParam ? ERROR_MESSAGES[errorParam] ?? "Something went wrong." : null;

  return (
    <form
      action={`/api/admin/courses/${course.id}/update`}
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={500}
          defaultValue={course.title}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={course.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={course.categoryId ?? ""}
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
        <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700">Instructor name</label>
        <input
          id="instructorName"
          name="instructorName"
          type="text"
          defaultValue={course.instructorName ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="learningOutcomes" className="block text-sm font-medium text-gray-700">What You Will Learn (one per line)</label>
        <textarea
          id="learningOutcomes"
          name="learningOutcomes"
          rows={5}
          defaultValue={course.learningOutcomes ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
        {course.thumbnail && (
          <div className="mt-1 mb-2">
            <p className="text-xs text-gray-500 mb-1">Current thumbnail:</p>
            <div className="relative h-24 w-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
        <input
          id="thumbnailFile"
          name="thumbnailFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-200"
        />
        <p className="mt-1 text-xs text-gray-500">Upload a new image to replace the thumbnail. Leave empty to keep the current thumbnail. Max 4 MB.</p>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          step={1}
          defaultValue={course.price ?? 0}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Save changes
        </button>
        <Link
          href={`/admin/dashboard/courses/${course.id}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
