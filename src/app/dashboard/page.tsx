import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardCoursesClient } from "./DashboardCoursesClient";

export const metadata = {
  title: "My Courses – Kulmis Academy",
  description: "Your enrolled courses.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session || session.role === "admin") redirect("/");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Courses</h1>
      <p className="mt-1 text-gray-600">
        Courses you have access to. Click Continue Learning to open the course player.
      </p>
      <DashboardCoursesClient />
    </div>
  );
}
