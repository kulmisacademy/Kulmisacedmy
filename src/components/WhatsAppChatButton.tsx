"use client";

const WHATSAPP_NUMBER = "252613609678";
const WHATSAPP_TEXT =
  "Hello Kulmis Academy support, I need help with a course.";

export function WhatsAppChatButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_TEXT
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-transform transition-shadow duration-200 group md:bottom-6 md:right-6"
      aria-label="Chat with Kulmis Academy on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M16.004 4C9.936 4 4.99 8.944 4.99 15.01c0 2.095.572 3.998 1.567 5.654L4 28l7.52-2.48A10.96 10.96 0 0 0 16.005 26C22.07 26 27.02 21.057 27.02 14.99 27.02 8.924 22.07 4 16.004 4zm0 19.6c-1.58 0-3.11-.42-4.46-1.216l-.32-.187-4.46 1.47 1.46-4.344-.207-.334A8.44 8.44 0 0 1 7.56 15c0-4.67 3.79-8.46 8.446-8.46 4.655 0 8.44 3.79 8.44 8.46 0 4.67-3.785 8.46-8.44 8.46zm4.67-6.33c-.255-.128-1.51-.744-1.743-.828-.234-.085-.404-.128-.575.128-.17.255-.66.828-.81.998-.149.17-.298.191-.553.064-.255-.128-1.077-.396-2.053-1.26-.758-.675-1.27-1.51-1.42-1.765-.149-.255-.016-.393.112-.52.115-.114.255-.297.383-.446.128-.149.17-.255.255-.425.085-.17.043-.319-.021-.447-.064-.128-.575-1.388-.788-1.9-.207-.495-.418-.427-.575-.435l-.49-.008c-.17 0-.446.064-.68.319-.234.255-.894.872-.894 2.127 0 1.255.916 2.466 1.043 2.638.128.17 1.8 2.744 4.36 3.846.61.263 1.086.42 1.457.538.612.195 1.168.168 1.61.102.491-.073 1.51-.617 1.724-1.213.213-.596.213-1.106.149-1.213-.064-.106-.234-.17-.49-.298z"
        />
      </svg>
      <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap rounded-full bg-gray-900/95 px-3 py-1 text-[11px] font-medium text-white shadow-lg opacity-0 transition-all duration-200 group-hover:block group-hover:opacity-100 group-hover:-translate-y-0.5">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

