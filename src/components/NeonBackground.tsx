"use client";

/**
 * Subtle neon animated background for Kulmis Academy branding.
 * Soft glowing gradients with neon blue/pink accents – non-distracting.
 */
export function NeonBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-pink-50/80" />
      {/* Animated soft glow orbs – CSS only, performant */}
      <div className="absolute -left-[20%] top-[10%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle,rgba(33,166,255,0.08)_0%,transparent_70%)] animate-neon-orb-slow" />
      <div className="absolute -right-[15%] bottom-[20%] h-[35vmax] w-[35vmax] rounded-full bg-[radial-gradient(circle,rgba(233,30,140,0.06)_0%,transparent_70%)] animate-neon-orb-slower" />
      <div className="absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,188,212,0.04)_0%,transparent_60%)] animate-neon-orb-slow" />
      {/* Very subtle flowing gradient overlay */}
      <div className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-br from-primary-100/30 via-transparent to-accent-pink/10 animate-neon-flow opacity-60" />
    </div>
  );
}
