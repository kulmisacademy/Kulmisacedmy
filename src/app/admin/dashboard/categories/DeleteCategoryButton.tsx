"use client";

import { deleteCategory } from "./actions";

type Props = { categoryId: number; categoryName: string };

export function DeleteCategoryButton({ categoryId, categoryName }: Props) {
  return (
    <form action={deleteCategory} className="inline">
      <input type="hidden" name="categoryId" value={categoryId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete category "${categoryName}"? Courses in this category will have their category cleared.`)) {
            e.preventDefault();
          }
        }}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
