import type { Review } from "@/lib/schema";

type ReviewWithUser = Review & { userName: string };

export function CourseReviewsSection({ reviews }: { reviews: ReviewWithUser[] }) {
  if (reviews.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-900">Student reviews</h2>
      <p className="mt-1 text-sm text-gray-500">What students say about this course.</p>
      <ul className="mt-4 space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{r.userName}</span>
              <span className="flex text-amber-400" aria-label={`${r.rating} out of 5 stars`}>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{r.reviewText}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
