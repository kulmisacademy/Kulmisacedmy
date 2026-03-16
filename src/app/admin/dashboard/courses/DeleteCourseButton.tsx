"use client";

export function DeleteCourseButton({ courseId, courseTitle }: { courseId: number; courseTitle: string }) {
  return (
    <form
      action={`/api/admin/courses/${courseId}/delete`}
      method="POST"
      onSubmit={(e) => {
        if (!confirm(`Delete "${courseTitle}"? This will also delete all lessons.`)) e.preventDefault();
      }}
      className="inline"
    >
      <button type="submit" className="text-red-600 hover:underline text-sm">
        Delete
      </button>
    </form>
  );
}
