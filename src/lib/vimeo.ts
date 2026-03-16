/**
 * Extract Vimeo video ID from URL for embedding.
 * Supports: https://vimeo.com/123456789, https://player.vimeo.com/video/123456789
 */
export function getVimeoVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;
  const match = trimmed.match(vimeoRegex);
  return match ? match[1] : null;
}

export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?badge=0&byline=0&portrait=0&title=0`;
}
