"use client";

import { useFormState } from "react-dom";
import { submitCourseReview } from "./actions";

type Props = { courseId: number };

export function ReviewForm({ courseId }: Props) {
  const [state, formAction] = useFormState(
    submitCourseReview.bind(null, courseId),
    null as { error?: string; success?: boolean } | null
  );

  if (state?.success) {
    return (
      <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        Thank you! Your review has been submitted and is pending approval. It will appear on the course page once approved.
      </p>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Write a review</h3>
      {state?.error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div className="mt-4">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1–5 stars) *</label>
        <select
          id="rating"
          name="rating"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Your review *</label>
        <textarea
          id="reviewText"
          name="reviewText"
          rows={4}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder='e.g. "This course helped me understand full stack development clearly."'
        />
      </div>
      <button
        type="submit"
        className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Submit review
      </button>
    </form>
  );
}
