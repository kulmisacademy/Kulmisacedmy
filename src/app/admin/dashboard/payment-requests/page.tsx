import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentRequests, courses } from "@/lib/schema";
import { ApproveRejectButtons } from "./ApproveRejectButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentRequestsPage() {
  const requests = await db
    .select({
      id: paymentRequests.id,
      name: paymentRequests.name,
      phone: paymentRequests.phone,
      courseId: paymentRequests.courseId,
      status: paymentRequests.status,
      createdAt: paymentRequests.createdAt,
      courseTitle: courses.title,
    })
    .from(paymentRequests)
    .leftJoin(courses, eq(paymentRequests.courseId, courses.id))
    .orderBy(desc(paymentRequests.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Payment requests</h1>
      <p className="mt-1 text-gray-600">Approve or reject payment requests. Approving grants the student access to the course.</p>
      {requests.length === 0 ? (
        <p className="mt-6 text-gray-500">No payment requests yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Student name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Request date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{r.courseTitle ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "pending" && (
                      <ApproveRejectButtons requestId={r.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
