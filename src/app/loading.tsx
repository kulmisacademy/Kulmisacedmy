export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      {/* Neon glows in logo colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="loading-glow-blue absolute w-[400px] h-[400px] rounded-full top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        />
        <div
          className="loading-glow-pink absolute w-[350px] h-[350px] rounded-full bottom-[20%] right-[30%]"
          aria-hidden
        />
        <div
          className="loading-orb-1 absolute w-3 h-3 rounded-full top-[30%] left-[20%]"
          aria-hidden
        />
        <div
          className="loading-orb-2 absolute w-3 h-3 rounded-full bottom-[35%] right-[25%]"
          aria-hidden
        />
      </div>

      {/* Logo only: KU (pink) + LMIS (cyan) / ACADEMY (pink) */}
      <div className="relative z-10 flex flex-col items-center loading-text-glow">
        <div className="flex items-baseline font-extrabold text-3xl sm:text-4xl tracking-tight">
          <span className="loading-logo-ku">KU</span>
          <span className="loading-logo-lmis">LMIS</span>
        </div>
        <span className="loading-logo-academy font-extrabold text-xl sm:text-2xl tracking-wider mt-0.5">
          ACADEMY
        </span>
      </div>

      {/* Progress bar – logo colors */}
      <div className="relative z-10 mt-10 h-1 w-48 overflow-hidden rounded-full bg-gray-200">
        <div
          className="loading-progress-bar h-full w-[30%] rounded-full bg-gradient-to-r from-[#00D4FF] to-[#FF1493]"
          aria-hidden
        />
      </div>
    </div>
  );
}
