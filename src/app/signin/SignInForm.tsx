"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { signIn } from "./actions";

export function SignInForm({ returnTo = "" }: { returnTo?: string }) {
  const router = useRouter();
  const [state, formAction] = useFormState(signIn, null);

  useEffect(() => {
    if (state && "redirectTo" in state && state.redirectTo) {
      router.refresh();
      window.location.href = state.redirectTo;
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="returnTo" value={returnTo} />
      {state && "error" in state && state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {state && "redirectTo" in state && state.redirectTo && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Redirecting…</p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Sign in
      </button>
    </form>
  );
}
