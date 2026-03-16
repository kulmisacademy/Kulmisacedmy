import Link from "next/link";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-primary-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Kulmis Academy
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Admin sign in</h1>
          <p className="mt-1 text-gray-600 text-sm">
            Sign in with your admin account to manage courses and lessons.
          </p>
          <AdminLoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          First time? Run <code className="bg-gray-100 px-1 rounded">npm run db:seed</code> to create an admin user.
        </p>
      </div>
    </div>
  );
}
