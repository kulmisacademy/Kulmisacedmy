"use client";

import Link from "next/link";
import { updateLessonOrder, deleteLesson } from "../actions";
import type { Lesson } from "@/lib/schema";

export function LessonRow({
  lesson,
  index,
  total,
  courseId,
}: {
  lesson: Lesson;
  index: number;
  total: number;
  courseId: number;
}) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
        <span className="font-medium text-gray-900 truncate">{lesson.title}</span>
        {lesson.duration != null && (
          <span className="text-sm text-gray-500 shrink-0">{lesson.duration} min</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/admin/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`}
          className="rounded p-1 text-sm font-medium text-primary-600 hover:bg-primary-50"
        >
          Edit
        </Link>
        <form action={updateLessonOrder.bind(null, lesson.id, index - 1)} className="inline">
          <button
            type="submit"
            disabled={index === 0}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Move up"
          >
            ↑
          </button>
        </form>
        <form action={updateLessonOrder.bind(null, lesson.id, index + 1)} className="inline">
          <button
            type="submit"
            disabled={index === total - 1}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Move down"
          >
            ↓
          </button>
        </form>
        <form
          action={deleteLesson.bind(null, lesson.id, courseId)}
          onSubmit={(e) => {
            if (!confirm(`Delete "${lesson.title}"?`)) e.preventDefault();
          }}
          className="inline"
        >
          <button type="submit" className="rounded p-1 text-red-600 hover:bg-red-50">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}
