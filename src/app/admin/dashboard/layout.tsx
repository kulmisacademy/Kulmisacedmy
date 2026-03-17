import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar userName={session.name ?? session.email ?? "Admin"} />
      <div className="lg:pl-64">
        <AdminTopBar userName={session.name ?? session.email ?? "Admin"} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
