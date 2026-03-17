"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export type DashboardCourse = {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price: number | null;
  instructorName: string | null;
  learningOutcomes: string | null;
  categoryId: number | null;
  createdAt: Date;
  lessonCount: number;
  firstLesson: { id: number | null; title: string | null } | undefined;
};

async function fetchDashboardCourses(): Promise<DashboardCourse[]> {
  const res = await fetch("/api/dashboard/courses", { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to fetch dashboard courses");
  const data = await res.json();
  return data.enrollments ?? [];
}

export function useDashboardCourses() {
  return useQuery({
    queryKey: queryKeys.dashboardCourses,
    queryFn: fetchDashboardCourses,
    staleTime: 0,
  });
}
