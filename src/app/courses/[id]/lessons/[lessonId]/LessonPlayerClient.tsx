"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CourseResource, LessonResource } from "@/lib/schema";
import { useLesson, type LessonData } from "@/hooks/use-lesson";
import { CourseResourcesBlock } from "../../CourseResourcesBlock";
import { LessonPlayerTabs } from "./LessonPlayerTabs";
import { LessonListSlide } from "./LessonListSlide";
import { LessonNavLink } from "./LessonNavLink";
import { LessonNotFoundMessage } from "./LessonNotFoundMessage";

function formatDuration(minutes: number | null): string {
  if (minutes == null) return "";
  const m = Math.floor(minutes);
  return `${m.toString().padStart(2, "0")}:00`;
}

type Props = { courseId: number; lessonId: number };

export function LessonPlayerClient({ courseId, lessonId }: Props) {
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const invalidIds = isNaN(courseId) || isNaN(lessonId) || courseId <= 0 || lessonId <= 0;
  const { data, isLoading, isError } = useLesson(
    invalidIds ? null : courseId,
    invalidIds ? null : lessonId
  );

  if (invalidIds) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <LessonNotFoundMessage courseId={Number.isNaN(courseId) || courseId <= 0 ? undefined : courseId} />
      </div>
    );
  }

  // Redirect when API returns redirectTo (401/403)
  useEffect(() => {
    if (data && "redirectTo" in data && data.redirectTo) {
      window.location.href = data.redirectTo;
    }
  }, [data]);

  const toggleFullscreen = () => {
    const el = videoWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-gray-500">Loading lesson…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <LessonNotFoundMessage courseId={courseId} />
      </div>
    );
  }

  // redirectTo handled by useEffect above
  if (data && "redirectTo" in data) {
    return null;
  }

  // Block reasons
  if (data && "blockReason" in data) {
    const reason = data.blockReason;
    if (reason === "course_missing") {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <LessonNotFoundMessage isCourseMissing />
        </div>
      );
    }
    if (reason === "not_found") {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <LessonNotFoundMessage courseId={courseId} />
        </div>
      );
    }
    if (reason === "session_limit") {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
            <h1 className="text-xl font-bold text-amber-800 dark:text-amber-200">Session limit</h1>
            <p className="mt-3 text-amber-700 dark:text-amber-300">
              This course is already being used on another device. Only one active session is allowed
              per account.
            </p>
            <Link
              href={`/courses/${courseId}`}
              className="mt-6 inline-block rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
            >
              Back to course
            </Link>
          </div>
        </div>
      );
    }
    if (reason === "pending_approval") {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Waiting for approval</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Your request is waiting for admin approval. Please wait.
            </p>
            <Link
              href={`/courses/${courseId}`}
              className="mt-6 inline-block rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              Back to course
            </Link>
          </div>
        </div>
      );
    }
  }

  // Full lesson data
  const lessonData = data as LessonData;
  const {
    course,
    allLessons,
    currentLesson,
    currentIndex,
    prevLesson,
    nextLesson,
    embedUrl,
    progressPercent,
    resources,
    courseResources: courseResourcesList,
  } = lessonData;

  return (
    <div className="flex-1 min-w-0">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 min-w-0">
            <Link href="/dashboard" className="hover:text-primary-600 shrink-0">
              Learning
            </Link>
            <span aria-hidden className="shrink-0">
              /
            </span>
            <Link
              href={`/courses/${courseId}`}
              className="hover:text-primary-600 truncate min-w-0 max-w-[120px] sm:max-w-[200px]"
            >
              {course.title}
            </Link>
            <span aria-hidden className="shrink-0">
              /
            </span>
            <span className="text-gray-900 truncate min-w-0 max-w-[100px] sm:max-w-none">
              {currentLesson.title}
            </span>
          </nav>

          <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2 gap-2">
              <span className="font-medium shrink-0">
                Lesson {currentIndex + 1} of {allLessons.length}
              </span>
              <span className="shrink-0">{progressPercent}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <aside className="hidden lg:block w-full lg:w-80 xl:w-96 shrink-0 order-2 lg:order-1">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sticky top-24">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Course Content</h2>
                  <Link
                    href={`/courses/${courseId}`}
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    View Entire Course
                  </Link>
                </div>
                <ul className="mt-4 space-y-1 max-h-[60vh] overflow-y-auto">
                  {allLessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <LessonNavLink
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm smooth-transition ${
                          lesson.id === currentLesson.id
                            ? "bg-primary-50 font-medium text-primary-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <span className="truncate flex-1">{lesson.title}</span>
                        {lesson.duration != null && (
                          <span className="shrink-0 text-gray-400">
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                      </LessonNavLink>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="mt-4 block w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Join Discussion
                </Link>
                {String(course.instructorName ?? "").trim() !== "" && (
                  <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                      {String(course.instructorName).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{String(course.instructorName)}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0 flex-1 order-1 lg:order-2 w-full">
              {/* 16:9 frame; overlay only on right so play button (center/bottom-left) stays visible */}
              <div
                ref={videoWrapperRef}
                className="relative rounded-lg sm:rounded-xl overflow-hidden bg-black w-full max-w-full shadow-lg ring-1 ring-gray-200/50 aspect-video"
              >
                {embedUrl ? (
                  <>
                    <iframe
                      src={embedUrl}
                      title={currentLesson.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    {/* Block clicks on right strip only (narrower on small screens so play control is never covered) */}
                    <div
                      className="absolute top-0 right-0 bottom-0 w-[14%] min-w-[48px] max-w-[100px] sm:w-[18%] sm:min-w-[72px] sm:max-w-[120px] z-10 cursor-default"
                      aria-hidden
                    />
                    {/* Fullscreen at top-right so the video's center/bottom-left play button stays visible and clickable */}
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-sm hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                      title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <>
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="hidden sm:inline">Exit fullscreen</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="hidden sm:inline">Fullscreen</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 p-4">
                    <div className="text-center text-sm sm:text-base">
                      <svg
                        className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <p className="mt-2">No video URL set for this lesson.</p>
                      <p className="text-xs sm:text-sm">Add a Vimeo or YouTube link in the admin.</p>
                    </div>
                  </div>
                )}
              </div>
              {embedUrl?.includes("vimeo.com") && (
                <p className="mt-2 text-xs text-gray-500">
                  If you see &quot;Sign in to Vimeo&quot;, the video owner must allow embedding: Vimeo → Video → Settings → Privacy → &quot;Where can this be embedded?&quot; → add this site&apos;s domain.
                </p>
              )}
              <div className="mt-3 lg:hidden">
                <LessonListSlide
                  lessons={allLessons.map((l) => ({ id: l.id, title: l.title, duration: l.duration }))}
                  courseId={courseId}
                  currentLessonId={currentLesson.id}
                  courseTitle={course.title as string}
                />
              </div>
              <h1 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl smooth-transition">
                {currentLesson.title}
              </h1>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
                {prevLesson ? (
                  <LessonNavLink
                    href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary-200 smooth-transition btn-neon min-w-0"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    Previous Lesson
                  </LessonNavLink>
                ) : null}
                {nextLesson ? (
                  <LessonNavLink
                    href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-white hover:bg-primary-600 shadow-md smooth-transition btn-neon min-w-0"
                  >
                    Next Lesson
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </LessonNavLink>
                ) : (
                  <Link
                    href={`/courses/${courseId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-white hover:bg-primary-600 shadow-md smooth-transition btn-neon min-w-0"
                  >
                    Back to course
                  </Link>
                )}
              </div>

              <LessonPlayerTabs
                overviewContent={currentLesson.description}
                resources={resources as LessonResource[]}
              />

              {Array.isArray(courseResourcesList) && courseResourcesList.length > 0 && (
                <div className="mt-8">
                  <CourseResourcesBlock resources={courseResourcesList as CourseResource[]} />
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
