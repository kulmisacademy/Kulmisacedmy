"use client";

import { approveReview, rejectReview, deleteReview } from "./actions";

type Props = { reviewId: number };

export function ApproveRejectDeleteButtons({ reviewId }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={approveReview.bind(null, reviewId)} className="inline">
        <button
          type="submit"
          className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
        >
          Approve
        </button>
      </form>
      <form action={rejectReview.bind(null, reviewId)} className="inline">
        <button
          type="submit"
          className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          Reject
        </button>
      </form>
      <form
        action={deleteReview.bind(null, reviewId)}
        onSubmit={(e) => {
          if (!confirm("Delete this review permanently?")) e.preventDefault();
        }}
        className="inline"
      >
        <button
          type="submit"
          className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
