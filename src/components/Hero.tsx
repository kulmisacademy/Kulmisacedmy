"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center overflow-hidden w-full">
      {/* Animated neon gradient background – brand colors #1297C9, #E43786 */}
      <div
        className="absolute inset-0 hero-neon-gradient"
        aria-hidden
      />
      {/* Semi-transparent overlay – darkens neon slightly for text readability */}
      <div className="absolute inset-0 hero-neon-overlay" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-3 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24 min-w-0">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center min-w-0">
          {/* Left: headline, description, CTAs */}
          <div className="text-center lg:text-left min-w-0">
            <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm whitespace-nowrap">
              Future Ready Learning
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white break-words sm:text-4xl lg:text-5xl xl:text-6xl">
              Learn Future Skills with{" "}
              <span className="text-white drop-shadow-[0_0_20px_rgba(228,55,134,0.5)]">
                Kulmis Academy
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-white/90 sm:text-lg mx-auto lg:mx-0 break-words">
              Master coding, AI, and technology with professional online courses.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base font-semibold text-[#1297C9] shadow-lg hover:bg-white/95 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Learning
                <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center rounded-xl border-2 border-white/80 bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all hover:border-white"
              >
                Browse Courses
              </Link>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center text-xs font-medium text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-white/85">
                Trusted by <strong>300+</strong> students in Somalia and worldwide
              </p>
            </div>
          </div>

          {/* Right: Neural Network card with animated tech background */}
          <div className="relative flex justify-center lg:justify-end min-w-0 w-full">
            <div className="hero-neural-card w-full max-w-full sm:max-w-md rounded-2xl border border-white/30 shadow-2xl relative min-h-[280px] sm:min-h-[380px]">
              {/* Animated technology background layers */}
              <div className="hero-neural-card-bg absolute inset-0 rounded-2xl" aria-hidden />
              <div className="hero-neural-card-glow rounded-2xl" aria-hidden />
              <div className="hero-neural-card-grid rounded-2xl" aria-hidden />
              {/* Neural connection lines */}
              <div className="hero-neural-card-lines rounded-2xl">
                <div className="hero-neural-card-line" />
                <div className="hero-neural-card-line" />
                <div className="hero-neural-card-line" />
                <div className="hero-neural-card-line" />
                <div className="hero-neural-card-line" />
              </div>
              {/* Data node particles */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden" aria-hidden>
                {[
                  { left: "12%", top: "18%" },
                  { left: "88%", top: "22%" },
                  { left: "15%", top: "72%" },
                  { left: "82%", top: "68%" },
                  { left: "50%", top: "35%" },
                  { left: "28%", top: "52%" },
                  { left: "70%", top: "48%" },
                  { left: "45%", top: "78%" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="hero-neural-card-particle"
                    style={{ left: pos.left, top: pos.top, animationDelay: `${i * 0.6}s` }}
                  />
                ))}
              </div>
              {/* Faint background code layer */}
              <div className="hero-neural-card-code rounded-2xl">
                <div className="hero-neural-card-code-inner">
                  {[1, 2].map((r) => (
                    <span key={r} className="whitespace-pre">
                      {"0 1 0 1  "}const node = {"{}"};{"  "}1 0 1{"\n"}
                      {"1 0 1 0  "}forward();{"  "}0 1 0 1 1{"\n"}
                      {"0 1  "}layer.weights{"  "}1 0 1 0{"\n"}
                    </span>
                  ))}
                </div>
              </div>
              {/* Card content: icon + Matrix code console + play button */}
              <div className="relative z-10 flex flex-col items-center p-6 sm:p-8 min-h-[320px] sm:min-h-[380px]">
                <div className="shrink-0 mb-3">
                  <svg
                    viewBox="0 0 120 120"
                    className="h-16 w-16 sm:h-20 sm:w-20 text-[#1297C9] drop-shadow-[0_0_12px_rgba(18,151,201,0.6)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="60" cy="40" r="18" />
                    <circle cx="35" cy="75" r="12" />
                    <circle cx="85" cy="75" r="12" />
                    <circle cx="60" cy="95" r="10" />
                    <path d="M60 58v-8M42 68l12-18M78 68l-12-18M50 82l10-22M70 82l-10-22M60 85v-10" />
                  </svg>
                </div>
                {/* Matrix-style Kulmis Academy code display */}
                <div className="hero-matrix-console hero-matrix-console-mask w-full min-w-0 flex-1 min-h-[120px] sm:min-h-[160px] text-[#1297C9]">
                  <div className="hero-matrix-console-inner px-1 w-full max-w-full">
                    {[1, 2].map((block) => (
                      <div key={block} className="space-y-0.5">
                        <div className="hero-matrix-line whitespace-pre">
                          <span className="token-comment">{"// Powered by Kulmis Academy"}</span>
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"function buildAI() {"} <span className="token-string">{"return \"Kulmis Academy\";"}</span> {"}"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"const academy = "} <span className="token-string">{"\"Kulmis Academy\""}</span> {";"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"AI.train("} <span className="token-string">{"\"Kulmis Academy\""}</span> {");"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"import { AI } from "} <span className="token-string">{"\"kulmis-academy\""}</span> {";"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"console.log("} <span className="token-string">{"\"Kulmis Academy AI Coding Platform\""}</span> {");"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          <span className="token-comment">{"// AI Learning System — Kulmis Academy"}</span>
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"const platform = "} <span className="token-string">{"\"Kulmis Academy\""}</span> {";"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          <span className="token-comment">{"// Powered by Kulmis Academy"}</span>
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"function buildAI() {"} <span className="token-string">{"return \"Kulmis Academy\";"}</span> {"}"}
                        </div>
                        <div className="hero-matrix-line whitespace-pre">
                          {"AI.train("} <span className="token-string">{"\"Kulmis Academy\""}</span> {");"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/courses"
                  className="hero-neural-card-play absolute bottom-6 right-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E43786] text-white shadow-lg"
                  aria-label="Start learning"
                >
                  <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
