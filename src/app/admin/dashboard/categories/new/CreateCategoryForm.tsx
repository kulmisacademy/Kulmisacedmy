"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { createCategory } from "../actions";

export function CreateCategoryForm() {
  const [state, formAction] = useFormState(createCategory, null);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={255}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. Web Development"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug (optional, auto-generated from name)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          maxLength={255}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. web-development"
        />
      </div>
      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
          Icon (optional, emoji or icon name)
        </label>
        <input
          id="icon"
          name="icon"
          type="text"
          maxLength={100}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. 💻 or code"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Create category
        </button>
        <Link
          href="/admin/dashboard/categories"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
