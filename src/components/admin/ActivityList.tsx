import Link from "next/link";

export type ActivityItem = {
  id: string;
  type: "purchase" | "signup" | "published" | "updated";
  title: string;
  userName?: string;
  timeAgo: string;
};

const iconPaths: Record<ActivityItem["type"], string> = {
  purchase: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  signup: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  published: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  updated: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
};

const labels: Record<ActivityItem["type"], string> = {
  purchase: "New purchase:",
  signup: "New student signed up:",
  published: "Course published:",
  updated: "Course updated:",
};

type Props = { items: ActivityItem[] };

export function ActivityList({ items }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <Link href="/admin/dashboard/courses" className="text-sm font-medium text-primary-600 hover:underline">
          View All
        </Link>
      </div>
      <ul className="mt-4 space-y-4">
        {items.length === 0 ? (
          <li className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[item.type]} />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{labels[item.type]}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {item.userName != null ? item.userName + " • " : ""}{item.timeAgo}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
