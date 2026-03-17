"use client";

const RESOURCE_ERROR_MESSAGES: Record<string, string> = {
  resource_title: "Resource title is required.",
  resource_type: "Select file upload or link.",
  resource_upload:
    "File upload failed. Use allowed types (PDF, ZIP, images, text, etc.) and max 10MB. On Vercel ensure BLOB_READ_WRITE_TOKEN is set and redeploy. Keep files under 4.5 MB for reliability.",
  resource_missing: "Provide a file upload or resource URL.",
  resource_save: "Failed to save resource. Please try again.",
};

type Props = { lessonId: number; courseId: number; errorParam?: string };

export function AddLessonResourceForm({ lessonId, courseId, errorParam }: Props) {
  const errorMessage = errorParam ? (RESOURCE_ERROR_MESSAGES[errorParam] ?? "Something went wrong.") : null;

  return (
    <form
      action={`/api/admin/courses/${courseId}/lessons/${lessonId}/resource`}
      method="POST"
      encType="multipart/form-data"
      className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h3 className="font-medium text-gray-900">Add resource</h3>
      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{errorMessage}</p>
      )}
      <div>
        <label htmlFor="resourceTitle" className="block text-sm font-medium text-gray-700">Resource Title *</label>
        <input
          id="resourceTitle"
          name="resourceTitle"
          type="text"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. Download Project Files"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="resourceType" value="file" defaultChecked className="rounded border-gray-300 text-primary-600" />
            <span className="text-sm">File upload</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="resourceType" value="link" className="rounded border-gray-300 text-primary-600" />
            <span className="text-sm">Link (URL)</span>
          </label>
        </div>
      </div>
      <div id="resource-file-wrap">
        <label htmlFor="resourceFile" className="block text-sm font-medium text-gray-700">File (PDF, ZIP, etc.)</label>
        <input
          id="resourceFile"
          name="resourceFile"
          type="file"
          className="mt-1 block w-full text-sm text-gray-600 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-primary-700"
        />
        <p className="mt-1 text-xs text-gray-500">Max 10 MB (under 4.5 MB recommended on Vercel). PDF, ZIP, text, images.</p>
      </div>
      <div>
        <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-700">Resource URL (if link)</label>
        <input
          id="resourceUrl"
          name="resourceUrl"
          type="url"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </div>
      <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
        Add resource
      </button>
    </form>
  );
}
