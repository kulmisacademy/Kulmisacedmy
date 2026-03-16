"use client";

import { deleteLessonResource } from "../../../../actions";
import type { LessonResource } from "@/lib/schema";

type Props = {
  resource: LessonResource;
  lessonId: number;
  courseId: number;
};

export function LessonResourceRow({ resource, lessonId, courseId }: Props) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <span className="font-medium text-gray-900 truncate">{resource.title}</span>
      <span className="text-xs text-gray-500 shrink-0">{resource.resourceType}</span>
      <form
        action={deleteLessonResource.bind(null, resource.id, lessonId, courseId)}
        onSubmit={(e) => {
          if (!confirm("Delete this resource?")) e.preventDefault();
        }}
        className="shrink-0"
      >
        <button type="submit" className="text-sm text-red-600 hover:underline">Delete</button>
      </form>
    </li>
  );
}
