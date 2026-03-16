"use client";

import { approvePaymentRequest, rejectPaymentRequest } from "./actions";

export function ApproveRejectButtons({ requestId }: { requestId: number }) {
  return (
    <div className="flex justify-end gap-2">
      <form action={approvePaymentRequest.bind(null, requestId)} className="inline">
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
        >
          Approve
        </button>
      </form>
      <form
        action={rejectPaymentRequest.bind(null, requestId)}
        onSubmit={(e) => {
          if (!confirm("Reject this payment request?")) e.preventDefault();
        }}
        className="inline"
      >
        <button
          type="submit"
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Reject
        </button>
      </form>
    </div>
  );
}
