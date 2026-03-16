import {
  getAnalyticsSummary,
  getMonthlyChartData,
  getCoursePopularity,
} from "../dashboard-data";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";

export const dynamic = "force-dynamic";

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function AcademicIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3z" />
    </svg>
  );
}

export default async function AdminAnalyticsPage() {
  const [summary, chartData, popularity] = await Promise.all([
    getAnalyticsSummary(),
    getMonthlyChartData(),
    getCoursePopularity(10),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        LMS statistics, revenue growth, and course popularity.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={summary.totalStudents.toLocaleString()} icon={<UsersIcon />} />
        <StatCard title="Total Courses" value={summary.totalCourses.toLocaleString()} icon={<BookIcon />} />
        <StatCard title="Total Revenue" value={`$${summary.totalRevenue.toLocaleString()}`} icon={<DollarIcon />} />
        <StatCard title="Course Enrollments" value={summary.totalEnrollments.toLocaleString()} icon={<AcademicIcon />} />
      </div>

      <div className="mt-6">
        <RevenueChart
          revenueData={chartData.revenueByMonth}
          enrollmentData={chartData.enrollmentsByMonth}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course popularity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enrollments by course</p>
        {popularity.length === 0 ? (
          <p className="mt-4 text-gray-500 dark:text-gray-400">No enrollments yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {popularity.map((item, i) => (
              <li key={item.courseId} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {i + 1}. {item.title}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.enrollments} enrollment{item.enrollments !== 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student activity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monthly enrollments (same as blue/pink chart above — enrollments in pink).
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          {chartData.enrollmentsByMonth.map((val, i) => (
            <div key={i} className="rounded-lg bg-primary-50 px-3 py-2 dark:bg-primary-900/20">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
              </span>
              <span className="ml-2 font-medium text-primary-700 dark:text-primary-300">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
