"use client";

import { useFormState } from "react-dom";
import { addLesson } from "../actions";

export function AddLessonForm({ courseId }: { courseId: number }) {
  const [state, formAction] = useFormState(
    addLesson.bind(null, courseId),
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Add lesson</h3>
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Optional"
        />
      </div>
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video Link (Vimeo or YouTube)</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="text"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://vimeo.com/123456789 or paste embed iframe"
        />
        <p className="mt-1 text-xs text-gray-500">Paste a video URL or the full Vimeo/YouTube embed iframe; the video ID will be saved.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Lesson Duration (minutes)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            min={0}
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
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Leave empty for next"
          />
          <p className="mt-1 text-xs text-gray-500">Optional. Next number is used if empty.</p>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPreview" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="text-sm font-medium text-gray-700">Preview lesson (free for non-enrolled students)</span>
        </label>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Add lesson
      </button>
    </form>
  );
}
