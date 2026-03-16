import type { CourseResource } from "@/lib/schema";

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

export function CourseResourcesBlock({ resources }: { resources: CourseResource[] }) {
  if (resources.length === 0) return null;

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Course Resources
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Downloadable files for this course.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {resources.map((res) => {
          const ext = getExtension(res.fileUrl);
          return (
            <li
              key={res.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {getFileIcon(ext)}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {res.title}
                  </p>
                  {res.description && (
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {res.description}
                    </p>
                  )}
                </div>
              </div>
              <a
                href={`/api/course-resources/${res.id}/download`}
                className="shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                download
              >
                Download
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
