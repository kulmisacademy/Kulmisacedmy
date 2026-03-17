"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvePaymentRequest, rejectPaymentRequest } from "./actions";
import { queryKeys } from "@/lib/query-keys";

export function ApproveRejectButtons({
  requestId,
  courseId,
}: {
  requestId: number;
  courseId: number;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);

  const approveMutation = useMutation({
    mutationFn: () => approvePaymentRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardCourses });
      queryClient.invalidateQueries({ queryKey: queryKeys.course(courseId) });
      router.refresh();
    },
  });
  const rejectMutation = useMutation({
    mutationFn: () => rejectPaymentRequest(requestId),
    onSuccess: () => router.refresh(),
  });

  async function handleApprove() {
    if (pending) return;
    setPending("approve");
    try {
      await approveMutation.mutateAsync(undefined);
    } finally {
      setPending(null);
    }
  }

  async function handleReject() {
    if (pending) return;
    if (!confirm("Reject this payment request?")) return;
    setPending("reject");
    try {
      await rejectMutation.mutateAsync(undefined);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={handleApprove}
        disabled={!!pending}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
      >
        {pending === "approve" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        onClick={handleReject}
        disabled={!!pending}
        className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {pending === "reject" ? "…" : "Reject"}
      </button>
    </div>
  );
}
