import { desc, sql, or, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { UserStatusSelect } from "./UserStatusSelect";
import { DeleteUserButton } from "./DeleteUserButton";
import { UserSearchForm } from "./UserSearchForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminUsersPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const allUsers = query
    ? await db
        .select()
        .from(users)
        .where(
          or(
            ilike(users.name, `%${query}%`),
            ilike(users.email, `%${query}%`),
            ilike(sql`COALESCE(${users.phone}, '')`, `%${query}%`)
          )
        )
        .orderBy(desc(users.createdAt))
    : await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View and manage users. Search by name, email, or phone.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UserSearchForm initialQuery={query} />
          <Link
            href="/admin/dashboard/payment-requests"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Payment Requests
          </Link>
        </div>
      </div>

      {allUsers.length === 0 ? (
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          {query ? "No users match your search." : "No users yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Full Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Registration Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {allUsers.map((user) => (
                <tr key={user.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.role === "admin" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <UserStatusSelect userId={user.id} currentStatus={(user as { status?: string }).status ?? "active"} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/admin/dashboard/users/${user.id}`}
                      className="text-primary-600 hover:underline dark:text-primary-400 mr-2"
                    >
                      View
                    </Link>
                    {user.role !== "admin" && (
                      <DeleteUserButton userId={user.id} userName={user.name} />
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
