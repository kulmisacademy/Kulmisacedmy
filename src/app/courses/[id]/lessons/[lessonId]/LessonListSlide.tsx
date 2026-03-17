"use client";

import { useState } from "react";
import { LessonNavLink } from "./LessonNavLink";

function formatDuration(minutes: number | null): string {
  if (minutes == null) return "";
  const m = Math.floor(minutes);
  return `${m.toString().padStart(2, "0")}:00`;
}

type Lesson = { id: number; title: string; duration: number | null };
type Props = {
  lessons: Lesson[];
  courseId: number;
  currentLessonId: number;
  courseTitle: string;
};

export function LessonListSlide({ lessons, courseId, currentLessonId, courseTitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-primary-50 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 smooth-transition"
        aria-label="Open lesson list"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Lessons
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Slide panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Lesson list"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h2 className="font-semibold text-gray-900">Course Content</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <p className="mb-2 px-2 text-xs font-medium text-gray-500 truncate" title={courseTitle}>
              {courseTitle}
            </p>
            <ul className="space-y-0.5">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <LessonNavLink
                    href={`/courses/${courseId}/lessons/${lesson.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm smooth-transition ${
                      lesson.id === currentLessonId
                        ? "bg-primary-50 font-medium text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                    {lesson.duration != null && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                  </LessonNavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
