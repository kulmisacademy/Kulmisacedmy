"use client";

import Link from "next/link";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

/**
 * Link for lesson navigation. Uses Next.js Link so client-side navigation
 * updates the URL; the lesson page uses useLesson(courseId, lessonId) which
 * refetches when the key changes, so the correct lesson loads without refresh.
 */
export function LessonNavLink({ href, className, children, onClick }: Props) {
  return (
    <Link href={href} prefetch={false} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
