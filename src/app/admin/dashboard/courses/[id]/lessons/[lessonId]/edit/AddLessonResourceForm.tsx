"use client";

import { useFormState } from "react-dom";
import { addLessonResource } from "../../../../actions";

type Props = { lessonId: number; courseId: number };

export function AddLessonResourceForm({ lessonId, courseId }: Props) {
  const [state, formAction] = useFormState(
    addLessonResource.bind(null, lessonId, courseId),
    null as { error?: string } | null
  );

  return (
    <form action={formAction} encType="multipart/form-data" className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="font-medium text-gray-900">Add resource</h3>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
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
        <p className="mt-1 text-xs text-gray-500">Max 10 MB. PDF, ZIP, text, images.</p>
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
