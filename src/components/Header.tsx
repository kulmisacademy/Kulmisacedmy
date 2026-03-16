"use client";

import { useState } from "react";
import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { signOut } from "@/app/actions";
import { KulmisLogo } from "./KulmisLogo";

const navLinks = [
  { href: "/courses", label: "Browse" },
  { href: "/dashboard", label: "My Learning" },
  { href: "/#instructors", label: "Instructors" },
];

type Props = { session?: SessionUser | null };

export function Header({ session }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-md transition-shadow duration-300 overflow-hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 min-w-0">
        <KulmisLogo variant="full" linkToHome className="shrink-0 min-w-0 max-w-[50%] sm:max-w-none" />

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-primary-600 smooth-transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 md:flex-initial items-center justify-end gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <div className="hidden lg:block flex-1 max-w-xs">
            <label htmlFor="header-search" className="sr-only">Search</label>
            <input
              id="header-search"
              type="search"
              placeholder="Search for courses..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 smooth-transition"
            />
          </div>
          {session ? (
            <>
              <Link
                href={session.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-primary-600 smooth-transition whitespace-nowrap"
              >
                {session.role === "admin" ? "Dashboard" : "My Courses"}
              </Link>
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-xs sm:text-sm">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <form action={signOut} className="inline shrink-0">
                <button
                  type="submit"
                  className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 smooth-transition whitespace-nowrap"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-primary-600 smooth-transition whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-500 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-md hover:bg-primary-600 btn-neon whitespace-nowrap"
              >
                Join for free
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 smooth-transition shrink-0"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-0.5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 smooth-transition"
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <Link
                href={session.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 smooth-transition"
              >
                {session.role === "admin" ? "Dashboard" : "My Courses"}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
