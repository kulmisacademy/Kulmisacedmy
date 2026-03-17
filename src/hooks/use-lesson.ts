"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export type LessonData = {
  course: { id: number; title: string; [key: string]: unknown };
  allLessons: Array<{ id: number; title: string; duration: number | null; isPreview: boolean; [key: string]: unknown }>;
  currentLesson: { id: number; title: string; description: string | null; videoUrl: string | null; [key: string]: unknown };
  currentIndex: number;
  prevLesson: { id: number; title: string; [key: string]: unknown } | null;
  nextLesson: { id: number; title: string; [key: string]: unknown } | null;
  embedUrl: string | null;
  progressPercent: number;
  resources: Array<unknown>;
  courseResources: Array<unknown>;
};

export type LessonApiResponse =
  | { redirectTo: string }
  | { blockReason: "session_limit" | "pending_approval" | "not_found" | "course_missing" }
  | LessonData;

async function fetchLesson(
  courseId: number,
  lessonId: number
): Promise<LessonApiResponse> {
  const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && data.redirectTo) return data;
  if (res.status === 403) return data;
  if (res.status === 404) return { blockReason: "not_found" as const };
  if (!res.ok) throw new Error("Failed to fetch lesson");
  return data as LessonData;
}

export function useLesson(courseId: number | null, lessonId: number | null) {
  return useQuery({
    queryKey: queryKeys.lesson(courseId ?? 0, lessonId ?? 0),
    queryFn: () => fetchLesson(courseId!, lessonId!),
    enabled: courseId != null && lessonId != null && courseId > 0 && lessonId > 0,
    staleTime: 0,
  });
}
