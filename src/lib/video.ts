/**
 * Parse video URLs and return embed info for Vimeo or YouTube.
 * Supports:
 * - Plain URLs: https://vimeo.com/123456789, https://youtube.com/watch?v=abc123
 * - Player URLs: https://player.vimeo.com/video/123456789?...
 * - Pasted iframe HTML: extracts src and then the video ID
 */

export type VideoEmbed = { type: "vimeo"; embedUrl: string } | { type: "youtube"; embedUrl: string };

/** If input is iframe HTML, extract the src URL; otherwise return trimmed string. */
export function extractVideoUrlFromInput(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const iframeSrcMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeSrcMatch) return iframeSrcMatch[1].replace(/&amp;/g, "&").trim();
  return trimmed;
}

export function getVimeoVideoId(url: string | null | undefined): string | null {
  const raw = extractVideoUrlFromInput(url);
  if (!raw) return null;
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;
  const match = raw.match(vimeoRegex);
  return match ? match[1] : null;
}

export function getYouTubeVideoId(url: string | null | undefined): string | null {
  const raw = extractVideoUrlFromInput(url);
  if (!raw) return null;
  // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
  ];
  for (const re of patterns) {
    const match = raw.match(re);
    if (match) return match[1];
  }
  return null;
}

/**
 * Normalize pasted iframe or long URL to a short canonical URL for storage (fits 500 char limit).
 * Returns e.g. "https://vimeo.com/1172550460" or "https://www.youtube.com/watch?v=abc123" or null.
 */
export function normalizeVideoUrlForStorage(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const url = extractVideoUrlFromInput(input);
  if (!url) return null;
  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) return `https://vimeo.com/${vimeoId}`;
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) return `https://www.youtube.com/watch?v=${youtubeId}`;
  return null;
}

/** Get embed URL for Vimeo (minimal UI: no badge, byline, portrait, title). */
export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?badge=0&byline=0&portrait=0&title=0&dnt=1`;
}

/** Get embed URL for YouTube (minimal branding, no related videos at end). */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
}

/** Parse a lesson video URL (or pasted iframe HTML) and return embed type + URL, or null if unsupported. */
export function getVideoEmbed(url: string | null | undefined): VideoEmbed | null {
  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) return { type: "vimeo", embedUrl: getVimeoEmbedUrl(vimeoId) };
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) return { type: "youtube", embedUrl: getYouTubeEmbedUrl(youtubeId) };
  return null;
}
