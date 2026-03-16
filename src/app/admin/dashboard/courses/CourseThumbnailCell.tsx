"use client";

import { useState } from "react";

export function CourseThumbnailCell({
  thumbnail,
  title,
}: {
  thumbnail: string | null;
  title: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = thumbnail && !failed;

  return (
    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-600">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400">
          {title.charAt(0)}
        </span>
      )}
    </div>
  );
}
