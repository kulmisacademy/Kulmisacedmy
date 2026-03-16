"use client";

const steps = [
  {
    number: 1,
    title: "Choose Your Course",
    description:
      "Pick from hundreds of specialized courses in AI, Development, and Design.",
  },
  {
    number: 2,
    title: "Watch & Practice",
    description:
      "Engage with high-definition video content and real-world coding challenges.",
  },
  {
    number: 3,
    title: "Master Your Skills",
    description:
      "Get certified and apply your knowledge to advance your career or build projects.",
  },
];

export default function PathToMastery() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left - Teal box with neon border and network pattern */}
          <div className="animate-neon-border-rotate relative flex h-[400px] items-center justify-center rounded-2xl border-2 bg-primary-500/90 p-8">
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-4 h-full w-full opacity-30 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={100 + 60 * Math.cos((i * Math.PI * 2) / 8)}
                  cy={100 + 60 * Math.sin((i * Math.PI * 2) / 8)}
                  r="4"
                />
              ))}
              {[...Array(8)].map((_, i) =>
                [...Array(8)].map((_, j) => {
                  if (i >= j) return null;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={100 + 60 * Math.cos((i * Math.PI * 2) / 8)}
                      y1={100 + 60 * Math.sin((i * Math.PI * 2) / 8)}
                      x2={100 + 60 * Math.cos((j * Math.PI * 2) / 8)}
                      y2={100 + 60 * Math.sin((j * Math.PI * 2) / 8)}
                    />
                  );
                })
              )}
            </svg>
          </div>

          {/* Right - Steps */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              The Path to <span className="text-accent-pink">Mastery</span>
            </h2>
            <ul className="mt-10 space-y-8">
              {steps.map((step) => (
                <li key={step.number} className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      step.number === 1
                        ? "bg-gray-900"
                        : step.number === 2
                        ? "bg-primary-500"
                        : "bg-accent-pink"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
