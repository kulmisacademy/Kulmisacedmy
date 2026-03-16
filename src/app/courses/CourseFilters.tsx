"use client";

import Link from "next/link";
import type { Category } from "@/lib/schema";

const displayName = (name: string) => {
  const short: Record<string, string> = {
    "Web Development": "Web Dev",
    "Data Science": "Data Science",
    "Mobile Development": "Mobile",
    "Artificial Intelligence": "AI",
  };
  return short[name] ?? name;
};

const iconClass = "h-5 w-5 shrink-0";

function IconAll({ active }: { active?: boolean }) {
  const c = active ? "#0ea5e9" : "#94a3b8";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconWebDev({ active }: { active?: boolean }) {
  const stroke = active ? "#0ea5e9" : "#38bdf8";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function IconDesign({ active }: { active?: boolean }) {
  const stroke = active ? "#e43786" : "#f472b6";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="6" />
      <circle cx="9" cy="9" r="1.5" fill={stroke} />
      <circle cx="14" cy="8" r="1.5" fill={stroke} />
      <circle cx="15" cy="13" r="1.5" fill={stroke} />
    </svg>
  );
}

function IconMarketing({ active }: { active?: boolean }) {
  const stroke = active ? "#a855f7" : "#c084fc";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a1 1 0 0 1-1.2 0L3 13V8l7.4 3.8a1 1 0 0 0 1.2 0L21 8v5l-9.4 3.8a1 1 0 0 1-1.2 0z" />
    </svg>
  );
}

function IconDataScience({ active }: { active?: boolean }) {
  const axis = active ? "#64748b" : "#94a3b8";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none">
      <path d="M4 20h16M4 20V8" stroke={axis} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 20v-5h2v5H8z" fill={active ? "#0ea5e9" : "#22c55e"} />
      <path d="M13 20v-3h2v3h-2z" fill={active ? "#0284c7" : "#16a34a"} />
      <path d="M18 20V9h2v11h-2z" fill={active ? "#e43786" : "#dc2626"} />
    </svg>
  );
}

function IconMobile({ active }: { active?: boolean }) {
  const stroke = active ? "#7c3aed" : "#a78bfa";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function IconAI({ active }: { active?: boolean }) {
  const stroke = active ? "#8b5cf6" : "#a78bfa";
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect x="2" y="14" width="8" height="6" rx="1" fill={active ? "rgba(139,92,246,0.2)" : "rgba(167,139,250,0.15)"} />
      <path d="M22 10h-4" />
      <rect x="14" y="4" width="8" height="6" rx="1" fill={active ? "rgba(228,55,134,0.2)" : "rgba(244,114,182,0.15)"} />
      <path d="M12 14v4M6 10v2M18 16v2" />
    </svg>
  );
}

const slugToIcon: Record<string, (props: { active?: boolean }) => JSX.Element> = {
  "web-development": IconWebDev,
  design: IconDesign,
  marketing: IconMarketing,
  "data-science": IconDataScience,
  "mobile-development": IconMobile,
  "artificial-intelligence": IconAI,
};

function CategoryIcon({ slug, active }: { slug: string; active?: boolean }) {
  const Icon = slugToIcon[slug];
  if (!Icon) return null;
  return <Icon active={active} />;
}

export function CourseFilters({
  categories,
  currentSlug,
}: {
  categories: Category[];
  currentSlug: string | null;
}) {
  const isAll = !currentSlug || currentSlug === "all";

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scroll-smooth">
      <Link
        href="/courses"
        className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          isAll
            ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        }`}
      >
        <IconAll active={isAll} />
        All Categories
      </Link>
      {categories.map((c) => {
        const active = currentSlug === c.slug;
        return (
          <Link
            key={c.id}
            href={`/courses?category=${encodeURIComponent(c.slug)}`}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            <CategoryIcon slug={c.slug} active={active} />
            {displayName(c.name)}
          </Link>
        );
      })}
    </div>
  );
}
