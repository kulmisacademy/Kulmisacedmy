import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { EditCategoryForm } from "./EditCategoryForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) notFound();

  const [category] = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
  if (!category) notFound();

  return (
    <div>
      <Link href="/admin/dashboard/categories" className="text-sm text-primary-600 hover:underline">
        ← Back to categories
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit category</h1>
      <EditCategoryForm category={category} />
    </div>
  );
}
