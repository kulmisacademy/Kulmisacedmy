"use client";

import { useState } from "react";

type Props = { src?: string | null; title: string; subtitle?: string | null };

/**
 * Course card thumbnail: image only, no text overlay.
 * Title, description, price, and actions are rendered below the image by the parent card.
 */
export function CourseThumbnail({ src, title }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = src && src.trim() !== "" && !imageFailed;

  if (showImage) {
    return (
      <div className="relative aspect-video w-full min-h-[140px] overflow-hidden rounded-t-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full min-h-[140px] items-center justify-center overflow-hidden rounded-t-xl bg-gray-200 text-4xl font-bold text-gray-400">
      {title.charAt(0)}
    </div>
  );
}

