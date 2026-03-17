/**
 * Centralized query keys for React Query.
 * Use these for invalidateQueries after mutations.
 */
export const queryKeys = {
  session: ["session"] as const,
  dashboardCourses: ["dashboard", "courses"] as const,
  course: (id: number) => ["course", id] as const,
  lesson: (courseId: number, lessonId: number) =>
    ["course", courseId, "lesson", lessonId] as const,
  coursesList: ["courses"] as const,
};
