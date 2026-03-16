"use client";

import { deleteCourse } from "./actions";

export function DeleteCourseButton({ courseId, courseTitle }: { courseId: number; courseTitle: string }) {
  return (
    <form
      action={deleteCourse}
      onSubmit={(e) => {
        if (!confirm(`Delete "${courseTitle}"? This will also delete all lessons.`)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <button type="submit" className="text-red-600 hover:underline text-sm">
        Delete
      </button>
    </form>
  );
}
