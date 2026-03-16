/**
 * Parse video URLs and return embed info for Vimeo or YouTube.
 * Supports:
 * - Vimeo: https://vimeo.com/123456789, https://player.vimeo.com/video/123456789
 * - YouTube: https://youtube.com/watch?v=abc123, https://youtu.be/abc123, https://www.youtube.com/embed/abc123
 */

export type VideoEmbed = { type: "vimeo"; embedUrl: string } | { type: "youtube"; embedUrl: string };

export function getVimeoVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;
  const match = trimmed.match(vimeoRegex);
  return match ? match[1] : null;
}

export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
  ];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1];
  }
  return null;
}

/** Get embed URL for Vimeo (no branding params). */
export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?badge=0&byline=0&portrait=0&title=0`;
}

/** Get embed URL for YouTube. */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/** Parse a lesson video URL and return embed type + URL, or null if unsupported. */
export function getVideoEmbed(url: string | null | undefined): VideoEmbed | null {
  if (!url || typeof url !== "string") return null;
  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) return { type: "vimeo", embedUrl: getVimeoEmbedUrl(vimeoId) };
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) return { type: "youtube", embedUrl: getYouTubeEmbedUrl(youtubeId) };
  return null;
}
