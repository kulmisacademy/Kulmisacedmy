"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { createCourse } from "../actions";
import type { Category } from "@/lib/schema";

export function CreateCourseForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useFormState(createCourse, null);

  return (
    <form action={formAction} encType="multipart/form-data" className="mt-6 space-y-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
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
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP or GIF. Max 4 MB. The uploaded image will be saved and used as the course thumbnail.</p>
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
