import Link from "next/link";
import { CreateCategoryForm } from "./CreateCategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/admin/dashboard/categories" className="text-sm text-primary-600 hover:underline">
        ← Back to categories
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">New category</h1>
      <CreateCategoryForm />
    </div>
  );
}
