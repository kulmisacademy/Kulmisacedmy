"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";

export type CategoryFormState = { error?: string } | null;

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = formData.get("name")?.toString()?.trim();
  const slugInput = formData.get("slug")?.toString()?.trim();
  const icon = formData.get("icon")?.toString()?.trim() || null;

  if (!name) return { error: "Category name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Slug could not be generated from name." };

  try {
    await db.insert(categories).values({ name, slug, icon });
  } catch (err) {
    console.error(err);
    return { error: "Failed to create category. Slug may already exist." };
  }
  redirect("/admin/dashboard/categories");
}

export async function updateCategory(
  id: number,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = formData.get("name")?.toString()?.trim();
  const slugInput = formData.get("slug")?.toString()?.trim();
  const icon = formData.get("icon")?.toString()?.trim() || null;

  if (!name) return { error: "Category name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Slug could not be generated from name." };

  try {
    await db.update(categories).set({ name, slug, icon }).where(eq(categories.id, id));
  } catch (err) {
    console.error(err);
    return { error: "Failed to update category. Slug may already be in use." };
  }
  redirect("/admin/dashboard/categories");
}

export async function deleteCategory(formData: FormData) {
  const idRaw = formData.get("categoryId")?.toString();
  const id = idRaw ? parseInt(idRaw, 10) : null;
  if (id == null || isNaN(id)) return;
  await db.delete(categories).where(eq(categories.id, id));
  redirect("/admin/dashboard/categories");
}
