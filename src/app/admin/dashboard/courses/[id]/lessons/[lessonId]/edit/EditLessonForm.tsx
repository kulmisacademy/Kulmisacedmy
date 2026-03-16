"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { updateLesson } from "../../../../actions";
import type { Lesson } from "@/lib/schema";

export function EditLessonForm({ lesson, courseId }: { lesson: Lesson; courseId: number }) {
  const [state, formAction] = useFormState(
    updateLesson.bind(null, lesson.id, courseId),
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Lesson Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={lesson.title}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. Introduction to Vibe Coding"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Lesson Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={lesson.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Optional"
        />
      </div>
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video Link (Vimeo or YouTube)</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={lesson.videoUrl ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://vimeo.com/123456789 or https://youtube.com/watch?v=abc123"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Lesson Duration (minutes)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            min={0}
            defaultValue={lesson.duration ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="10"
          />
        </div>
        <div>
          <label htmlFor="lessonOrder" className="block text-sm font-medium text-gray-700">Lesson Order Number</label>
          <input
            id="lessonOrder"
            name="lessonOrder"
            type="number"
            min={0}
            defaultValue={lesson.lessonOrder}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPreview"
            defaultChecked={lesson.isPreview}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Preview lesson (free for non-enrolled students)</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Save changes
        </button>
        <Link
          href={`/admin/dashboard/courses/${courseId}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
