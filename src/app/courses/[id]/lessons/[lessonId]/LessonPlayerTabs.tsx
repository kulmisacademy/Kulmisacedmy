"use client";

import { useState } from "react";
import type { LessonResource } from "@/lib/schema";

const TABS = ["Overview", "Resources", "Notes", "Reviews"] as const;

type Props = {
  overviewContent: string | null;
  lessonTitle?: string;
  resources: LessonResource[];
};

export function LessonPlayerTabs({ overviewContent, resources }: Props) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Overview");

  return (
    <div className="mt-6 sm:mt-8">
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-4 sm:gap-6 min-w-0" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`shrink-0 border-b-2 py-3 text-xs sm:text-sm font-medium smooth-transition ${
                active === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-3 sm:py-4">
        {active === "Overview" && (
          <div className="prose prose-sm max-w-none text-gray-600">
            {overviewContent ? (
              <p className="whitespace-pre-wrap">{overviewContent}</p>
            ) : (
              <p>No overview content for this lesson.</p>
            )}
          </div>
        )}
        {active === "Resources" && (
          <div>
            {resources.length === 0 ? (
              <p className="text-sm text-gray-500">No resources for this lesson.</p>
            ) : (
              <ul className="space-y-3">
                {resources.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.fileUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 hover:border-primary-200 transition-colors"
                    >
                      {r.resourceType === "file" ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {active === "Notes" && (
          <p className="text-sm text-gray-500">No notes yet.</p>
        )}
        {active === "Reviews" && (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
