"use client";

import { useRouter } from "next/navigation";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

/**
 * Link that refreshes router cache then navigates, so the target lesson page
 * always fetches fresh data (avoids "Lesson not found" from stale cache).
 */
export function LessonNavLink({ href, className, children, onClick }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    router.refresh();
    router.push(href);
    onClick?.();
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
