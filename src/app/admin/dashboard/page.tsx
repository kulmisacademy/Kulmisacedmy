import {
  getDashboardStats,
  getMonthlyChartData,
  getRecentActivity,
  getCourseTableData,
  getDashboardSummaryCards,
} from "./dashboard-data";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ActivityList } from "@/components/admin/ActivityList";
import { CourseTable } from "@/components/admin/CourseTable";

export const dynamic = "force-dynamic";

function DollarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EnrollmentIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3z" />
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

function CompletedIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const [stats, chartData, activity, courseRows, summary] = await Promise.all([
    getDashboardStats(),
    getMonthlyChartData(),
    getRecentActivity(8),
    getCourseTableData(true),
    getDashboardSummaryCards(),
  ]);

  const revenueFormatted =
    stats.totalRevenue >= 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(stats.totalRevenue)
      : "$0";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your academy performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={summary.totalStudents.toLocaleString()}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Total Courses"
          value={summary.totalCourses.toLocaleString()}
          icon={<BookIcon />}
        />
        <StatCard
          title="Total Enrollments"
          value={summary.totalEnrollments.toLocaleString()}
          icon={<EnrollmentIcon />}
        />
        <StatCard
          title="Completed Courses"
          value={summary.completedCourses.toLocaleString()}
          subtitle="Students who finished a course"
          icon={<CompletedIcon />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={revenueFormatted}
          growth={stats.revenueGrowth}
          growthPositive={true}
          icon={<DollarIcon />}
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents.toLocaleString()}
          growth={stats.studentsGrowth}
          growthPositive={true}
          subtitle="Registered students"
          icon={<UsersIcon />}
        />
        <StatCard
          title="Course Completion"
          value={`${stats.courseCompletionRate}%`}
          subtitle="Avg. completion rate"
          icon={<CheckIcon />}
        />
        <StatCard
          title="New Enrollments"
          value={stats.newEnrollments.toLocaleString()}
          growth={stats.enrollmentGrowth}
          growthPositive={true}
          subtitle="This month so far"
          icon={<EnrollmentIcon />}
        />
      </div>

      <RevenueChart
        revenueData={chartData.revenueByMonth}
        enrollmentData={chartData.enrollmentsByMonth}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityList items={activity} />
        </div>
        <div className="lg:col-span-2">
          <CourseTable courses={courseRows} showPerformance />
        </div>
      </div>
    </div>
  );
}
