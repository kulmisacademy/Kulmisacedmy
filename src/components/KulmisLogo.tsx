"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

/** Logo colors: neon pink (KU + ACADEMY), cyan/blue (LMIS) */
const LOGO_PINK = "#FF1493";
const LOGO_CYAN = "#00D4FF";

type Props = {
  /** Compact: single line. Full: stacked KULMIS / ACADEMY */
  variant?: "full" | "compact";
  linkToHome?: boolean;
  className?: string;
};

/** Text-only logo: KU (pink) + LMIS (cyan), then ACADEMY (pink) */
function LogoText({ variant, className = "" }: { variant: "full" | "compact"; className?: string }) {
  if (variant === "compact") {
    return (
      <span className={`inline-flex items-baseline font-bold tracking-tight ${className}`}>
        <span style={{ color: LOGO_PINK }}>KU</span>
        <span style={{ color: LOGO_CYAN }}>LMIS</span>
        <span style={{ color: LOGO_PINK }}> ACADEMY</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex flex-col items-start font-bold tracking-tight leading-tight ${className}`}>
      <span className="flex items-baseline">
        <span style={{ color: LOGO_PINK }}>KU</span>
        <span style={{ color: LOGO_CYAN }}>LMIS</span>
      </span>
      <span style={{ color: LOGO_PINK }}>ACADEMY</span>
    </span>
  );
}

export function KulmisLogo({ variant = "full", linkToHome = true, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);
  const useImage = !imgError;

  const content = useImage ? (
    <Image
      src="/kulmis-logo.png"
      alt="Kulmis Academy"
      width={variant === "compact" ? 120 : 180}
      height={variant === "compact" ? 36 : 56}
      className={`object-contain object-left ${variant === "compact" ? "h-9 w-auto" : "h-9 w-auto max-w-[140px] sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-none"} ${className}`}
      onError={() => setImgError(true)}
      priority
    />
  ) : (
    <LogoText variant={variant} className={variant === "compact" ? "text-base" : "text-base sm:text-xl lg:text-2xl"} />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="flex shrink-0 items-center smooth-transition hover:opacity-90">
        {content}
      </Link>
    );
  }
  return <div className="flex shrink-0 items-center">{content}</div>;
}
