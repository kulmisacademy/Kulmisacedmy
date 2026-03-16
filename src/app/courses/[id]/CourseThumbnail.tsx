"use client";

import { useState } from "react";

const PARTICLE_POSITIONS = [
  { left: "10%", top: "20%" },
  { left: "85%", top: "15%" },
  { left: "20%", top: "70%" },
  { left: "75%", top: "80%" },
  { left: "50%", top: "35%" },
  { left: "35%", top: "55%" },
  { left: "65%", top: "45%" },
  { left: "90%", top: "60%" },
];

type Props = { src?: string | null; title: string; subtitle?: string | null };

function AnimatedCardContent({ title, subtitle }: { title: string; subtitle?: string | null }) {
  return (
    <>
      <div className="course-preview-bg absolute inset-0" />
      <div className="course-preview-lines" aria-hidden />
      <div className="course-preview-glow" aria-hidden />
      <div className="course-preview-particles">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="course-preview-particle"
            style={{ left: pos.left, top: pos.top, animationDelay: `${i * 0.7}s` }}
            aria-hidden
          />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-[15%] top-[25%] h-2 w-2 rounded-full bg-[var(--brand-blue)] opacity-40 animate-pulse" style={{ animationDuration: "2.5s" }} />
        <div className="absolute right-[20%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)] opacity-50" />
        <div className="absolute left-[25%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-[var(--brand-blue)] opacity-40" />
        <div className="absolute right-[15%] bottom-[25%] h-2 w-2 rounded-full bg-[var(--brand-pink)] opacity-30" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative flex h-full items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white backdrop-blur-sm sm:h-12 sm:w-12 sm:text-2xl">
            {title.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white line-clamp-2 drop-shadow-md" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-white/85 line-clamp-2" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="course-preview-play flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary-600 shadow-lg sm:h-12 sm:w-12">
          <svg className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </>
  );
}

export function CourseThumbnail({ src, title, subtitle }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = src && src.trim() !== "" && !imageFailed;

  if (showImage) {
    return (
      <div className="course-preview-card relative aspect-video w-full min-h-[140px] overflow-hidden rounded-none sm:rounded-xl bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
        <div className="relative flex h-full items-center justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white backdrop-blur-sm sm:h-12 sm:w-12 sm:text-2xl">
              {title.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white line-clamp-2 drop-shadow-md" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-xs sm:text-sm text-white/85 line-clamp-2" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="course-preview-play flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary-600 shadow-lg sm:h-12 sm:w-12">
            <svg className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-preview-card group relative aspect-video w-full min-h-[140px] overflow-hidden rounded-none sm:rounded-xl">
      <AnimatedCardContent title={title} subtitle={subtitle} />
    </div>
  );
}

