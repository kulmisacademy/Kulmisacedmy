"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export type CourseDetailResponse = {
  course: {
    id: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    price: number | null;
    instructorName: string | null;
    learningOutcomes: string | null;
    categoryId: number | null;
    createdAt: Date;
  };
  lessons: Array<{
    id: number;
    courseId: number;
    title: string;
    description: string | null;
    videoUrl: string | null;
    lessonOrder: number;
    duration: number | null;
    isPreview: boolean;
    createdAt: Date;
  }>;
  isEnrolled: boolean;
  userPhone: string | null;
  hasPendingPayment: boolean;
  session: { userId: number; email: string; name: string; role: string } | null;
  reviews: Array<unknown>;
  resources: Array<unknown>;
};

async function fetchCourse(id: number): Promise<CourseDetailResponse> {
  const res = await fetch(`/api/courses/${id}`, { cache: "no-store" });
  if (res.status === 404) throw new Error("Course not found");
  if (!res.ok) throw new Error("Failed to fetch course");
  return res.json();
}

export function useCourse(courseId: number | null) {
  return useQuery({
    queryKey: queryKeys.course(courseId ?? 0),
    queryFn: () => fetchCourse(courseId!),
    enabled: courseId != null && courseId > 0,
    staleTime: 0,
  });
}
