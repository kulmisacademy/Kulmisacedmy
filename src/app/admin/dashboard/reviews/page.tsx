import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews, users, courses } from "@/lib/schema";
import { ApproveRejectDeleteButtons } from "./ApproveRejectDeleteButtons";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const allReviews = await db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      courseId: reviews.courseId,
      rating: reviews.rating,
      reviewText: reviews.reviewText,
      status: reviews.status,
      createdAt: reviews.createdAt,
      userName: users.name,
      courseTitle: courses.title,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .innerJoin(courses, eq(reviews.courseId, courses.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Course reviews</h1>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          ← Dashboard
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Approve reviews to show them on the course page. Only approved reviews are visible to students.
      </p>

      <div className="mt-8 space-y-6">
        {allReviews.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500 shadow-sm">
            No reviews yet.
          </p>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Review</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {allReviews.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.courseTitle}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                        <span className="text-gray-300">{"☆".repeat(5 - r.rating)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{r.reviewText}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
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
                      <td className="px-4 py-3">
                        <ApproveRejectDeleteButtons reviewId={r.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
