export const DEFAULT_CDN_DOMAIN = "https://phimimg.com";
export const FALLBACK_POSTER = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80";
export const FALLBACK_BACKDROP = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&auto=format&fit=crop&q=80";

/**
 * Normalizes movie poster/backdrop URLs returned by the API
 */
export function getMovieImageUrl(
  pathOrUrl?: string | null,
  type: "poster" | "backdrop" = "poster",
  customCdn?: string
): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string" || pathOrUrl.trim() === "") {
    return type === "backdrop" ? FALLBACK_BACKDROP : FALLBACK_POSTER;
  }

  const trimmed = pathOrUrl.trim();

  // If already proxied
  if (trimmed.startsWith("/api/images")) {
    return trimmed;
  }

  // If it's a full URL containing phimimg.com or phimapi.com
  if (trimmed.includes("phimimg.com") || trimmed.includes("phimapi.com")) {
    try {
      const parsed = new URL(trimmed);
      return `/api/images?p=${encodeURIComponent(parsed.pathname)}`;
    } catch {
      return `/api/images?p=${encodeURIComponent(trimmed)}`;
    }
  }

  // Already a full URL from other hosts (e.g. tmdb.org, unsplash)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  // Route through internal proxy using clean path (no domain exposed!)
  return `/api/images?p=${encodeURIComponent(cleanPath)}`;
}
