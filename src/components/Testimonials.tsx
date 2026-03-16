"use client";

const testimonials = [
  {
    quote:
      "Casharka Full Stack AI ee Kulmis Academy runtii wuxuu ii furay faham cusub. Waxaan bartay sida AI loogu daro web applications anigoo isticmaalaya JavaScript iyo APIs. Vibe Coding-ka la barayo waa mid aad u fudud oo qof walba fahmi karo.",
    name: "Abdullahi Hassan",
    avatar: "AH",
  },
  {
    quote:
      "Markii hore coding aad ayaan uga cabsan jiray, laakiin casharrada Vibe Coding ee Kulmis Academy ayaa iga dhigay mid kalsooni leh. Macallinku wuxuu si fudud u sharxaa sida loo dhiso websites iyo AI tools.",
    name: "Hodan Ali",
    avatar: "HA",
  },
  {
    quote:
      "Course-kan Full Stack AI wuxuu iga caawiyay inaan dhiso project-kii ugu horreeyay ee AI website ah. Waxaan si gaar ah uga helay sida casharradu u yihiin practical oo lagu sameynayo projects dhab ah.",
    name: "Mohamed Abdi",
    avatar: "MA",
  },
  {
    quote:
      "Waxaan aad uga helay qaabka wax loo barayo ee Kulmis Academy. Casharrada Vibe Coding waa kuwo fudud, la fahmi karo, isla markaana qofka si tartiib tartiib ah u horumarinaya.",
    name: "Amina Mohamed",
    avatar: "AM",
  },
  {
    quote:
      "Kulmis Academy waa mid ka mid ah meelaha ugu fiican ee lagu barto Full Stack AI. Waxaan hadda awood u leeyahay inaan sameeyo web applications leh AI features.",
    name: "Yusuf Ahmed",
    avatar: "YA",
  },
  {
    quote:
      "Casharrada AI coding-ka ee Kulmis Academy waxay iga caawiyeen inaan fahmo sida AI loogu isticmaalo real projects. Waxaan ku dhisay chatbot iyo automation tools.",
    name: "Sahra Hassan",
    avatar: "SH",
  },
  {
    quote:
      "Vibe Coding waa hab cusub oo coding loo barto. Kulmis Academy waxay si fiican u sharaxday sida AI iyo programming la isku daro si loo dhiso applications casri ah.",
    name: "Ahmed Nur",
    avatar: "AN",
  },
  {
    quote:
      "Waxaan aad ula dhacay sida Kulmis Academy ay casharrada ugu dhistay qaab fudud oo qof walba baran karo. Full Stack AI course-kan wuxuu ii noqday bilow fiican oo mustaqbalka tech ah.",
    name: "Fatima Abdullahi",
    avatar: "FA",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="h-5 w-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  avatar,
}: {
  quote: string;
  name: string;
  avatar: string;
}) {
  return (
    <article
      className="testimonial-card relative flex flex-shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm min-w-[300px] sm:min-w-[340px] md:min-w-[360px]"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, sans-serif" }}
    >
      {/* Decorative quote icon – neon accent, top of card */}
      <span className="testimonial-quote-icon" aria-hidden>
        &ldquo;
      </span>
      <div className="relative z-10">
        <StarRating />
        <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
          {quote}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
            {avatar}
          </div>
          <p className="font-semibold text-gray-900">{name}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const duplicated = [...testimonials, ...testimonials];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          What Our{" "}
          <span className="text-primary-600">Students Say</span>
        </h2>
        <div className="mt-10 overflow-hidden" aria-label="Student testimonials carousel">
          <div className="testimonials-slider cursor-default">
            <div className="testimonial-track flex gap-6">
              {duplicated.map((t, i) => (
                <TestimonialCard
                  key={`${t.name}-${i}`}
                  quote={t.quote}
                  name={t.name}
                  avatar={t.avatar}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
