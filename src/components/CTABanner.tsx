"use client";

import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-24 lg:py-28">
      {/* Animated glow lines / stars */}
      <div className="absolute inset-0">
        <div
          className="cta-glow-line absolute left-1/4 top-1/4 h-px w-1/3 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="cta-glow-line absolute right-1/4 top-1/3 h-px w-1/4 bg-gradient-to-r from-transparent via-accent-pink/50 to-transparent"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="cta-glow-line absolute bottom-1/3 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-accent-teal/50 to-transparent"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(33, 166, 255, 0.4) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Start Your Learning Journey Today
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Join thousands of others in learning the skills of the future. The
          best time to start was yesterday. The second best time is now.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/join"
            className="inline-flex items-center rounded-lg bg-primary-500 px-6 py-3.5 text-base font-medium text-white shadow-lg hover:bg-primary-400 transition-colors"
          >
            Get Started For Free
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center rounded-lg border-2 border-primary-400 bg-transparent px-6 py-3.5 text-base font-medium text-white hover:bg-white/10 transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
