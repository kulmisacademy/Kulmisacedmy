"use client";

import { useFormState } from "react-dom";
import { addCourseResource, deleteCourseResource } from "../../actions";
import type { CourseResource } from "@/lib/schema";

const ALLOWED_ACCEPT =
  ".zip,.pdf,.docx,.xlsx,.pptx,.txt,application/zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain";

function getFileIcon(extension: string) {
  const ext = (extension || "").toLowerCase();
  if (ext === "pdf") return "📄";
  if (ext === "zip") return "📦";
  if (["docx", "doc"].includes(ext)) return "📝";
  if (["xlsx", "xls"].includes(ext)) return "📊";
  if (["pptx", "ppt"].includes(ext)) return "📽️";
  return "📎";
}

function getExtension(fileUrl: string): string {
  const match = /\.([a-z0-9]+)(?:\?|$)/i.exec(fileUrl);
  return match ? match[1].toLowerCase() : "";
}

function isExternalLink(fileUrl: string): boolean {
  const u = (fileUrl || "").trim();
  return u.startsWith("http://") || u.startsWith("https://");
}

export function CourseResourcesSection({
  courseId,
  resources,
}: {
  courseId: number;
  resources: CourseResource[];
}) {
  const [state, formAction] = useFormState(
    addCourseResource.bind(null, courseId),
    null as { error?: string } | null
  );

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Course Resources
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a file upload or a link. Files: ZIP, PDF, DOCX, XLSX, PPTX, TXT. Max 100MB per file.
        Only enrolled students can access these.
      </p>

      <form
        action={formAction}
        encType="multipart/form-data"
        className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </p>
        )}
        <div>
          <label
            htmlFor="resourceTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Resource Title *
          </label>
          <input
            id="resourceTitle"
            name="resourceTitle"
            type="text"
            required
            maxLength={500}
            placeholder="e.g. Project Source Code"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="resourceUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Resource URL (if link)
          </label>
          <input
            id="resourceUrl"
            name="resourceUrl"
            type="url"
            placeholder="https://..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty if you are uploading a file.
          </p>
        </div>
        <div>
          <label
            htmlFor="resourceFile"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            File Upload (if not using a link)
          </label>
          <input
            id="resourceFile"
            name="resourceFile"
            type="file"
            accept={ALLOWED_ACCEPT}
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 dark:text-gray-400 dark:file:bg-primary-900/30 dark:file:text-primary-300"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Provide either a URL above or a file here.
          </p>
        </div>
        <div>
          <label
            htmlFor="resourceDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description (optional)
          </label>
          <textarea
            id="resourceDescription"
            name="resourceDescription"
            rows={2}
            placeholder="Brief description of the resource"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Add resource
        </button>
      </form>

      {resources.length > 0 && (
        <ul className="mt-4 space-y-2">
          {resources.map((res) => {
            const ext = getExtension(res.fileUrl);
            const isLink = isExternalLink(res.fileUrl);
            return (
              <li
                key={res.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl" aria-hidden>
                    {isLink ? "🔗" : getFileIcon(ext)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {res.title}
                    </p>
                    {res.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>
                <form action={deleteCourseResource} className="inline">
                  <input type="hidden" name="resourceId" value={res.id} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
      {resources.length === 0 && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          No course resources yet. Add one above.
        </p>
      )}
    </div>
  );
}
