"use client";

import Link from "next/link";
import { KulmisLogo } from "./KulmisLogo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <KulmisLogo variant="compact" linkToHome className="shrink-0" />
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kulmis Academy. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700 smooth-transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700 smooth-transition"
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-sm text-gray-500 hover:text-gray-700 smooth-transition"
            >
              Contact Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
