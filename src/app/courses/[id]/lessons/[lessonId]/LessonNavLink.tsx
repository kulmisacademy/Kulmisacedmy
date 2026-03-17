"use client";

import { useRouter } from "next/navigation";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function LessonNavLink({ href, className, children, onClick }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    router.push(href);
    setTimeout(() => {
      router.refresh();
    }, 100);
    setTimeout(() => {
      // Fallback: if the App Router cache still causes stale data,
      // force a full navigation for this critical flow.
      if (window.location.pathname !== href) {
        window.location.href = href;
      }
    }, 800);
    onClick?.();
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
