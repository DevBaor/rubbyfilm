/**
 * TMDB (The Movie Database) Integration
 * Fetches original 4K / Full HD backdrops and high-res posters when TMDB_API_KEY is configured.
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_ORIGINAL = "https://image.tmdb.org/t/p/original";
const TMDB_IMAGE_W1280 = "https://image.tmdb.org/t/p/w1280";

// In-memory LRU cache to avoid hammering TMDB API
const tmdbBackdropCache = new Map<string, string>();

export async function getTmdbBackdropUrl(
  tmdbId?: string | number | null,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !tmdbId) return null;

  const idStr = String(tmdbId);
  const cacheKey = `${type}-${idStr}`;

  if (tmdbBackdropCache.has(cacheKey)) {
    return tmdbBackdropCache.get(cacheKey) || null;
  }

  try {
    const endpoint = `${TMDB_BASE_URL}/${type}/${idStr}?api_key=${apiKey}&language=vi-VN,en-US`;
    const res = await fetch(endpoint, {
      next: { revalidate: 86400 * 7 }, // Cache for 7 days
    });

    if (!res.ok) {
      // If tv failed, try movie or vice versa
      const fallbackType = type === "movie" ? "tv" : "movie";
      const fallbackRes = await fetch(
        `${TMDB_BASE_URL}/${fallbackType}/${idStr}?api_key=${apiKey}&language=vi-VN,en-US`,
        { next: { revalidate: 86400 * 7 } }
      );
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.backdrop_path) {
          const url = `${TMDB_IMAGE_ORIGINAL}${data.backdrop_path}`;
          tmdbBackdropCache.set(cacheKey, url);
          return url;
        }
      }
      return null;
    }

    const data = await res.json();
    if (data.backdrop_path) {
      const url = `${TMDB_IMAGE_ORIGINAL}${data.backdrop_path}`;
      tmdbBackdropCache.set(cacheKey, url);
      return url;
    }

    // Fallback: check /images endpoint for untagged high-res backdrops
    const imgRes = await fetch(`${TMDB_BASE_URL}/${type}/${idStr}/images?api_key=${apiKey}`);
    if (imgRes.ok) {
      const imgData = await imgRes.json();
      if (imgData.backdrops && imgData.backdrops.length > 0) {
        const url = `${TMDB_IMAGE_ORIGINAL}${imgData.backdrops[0].file_path}`;
        tmdbBackdropCache.set(cacheKey, url);
        return url;
      }
    }
  } catch (error) {
    console.error(`[TMDB] Error fetching backdrop for ID ${tmdbId}:`, error);
  }

  return null;
}

const tmdbLogoCache = new Map<string, string>();

export async function getTmdbLogoUrl(
  tmdbId?: string | number | null,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !tmdbId) return null;

  const idStr = String(tmdbId);
  const cacheKey = `${type}-${idStr}`;

  if (tmdbLogoCache.has(cacheKey)) {
    return tmdbLogoCache.get(cacheKey) || null;
  }

  try {
    const endpoint = `${TMDB_BASE_URL}/${type}/${idStr}/images?api_key=${apiKey}&include_image_language=vi,en,null`;
    let res = await fetch(endpoint, {
      next: { revalidate: 86400 * 7 }, // Cache for 7 days
    });

    if (!res.ok) {
      const fallbackType = type === "movie" ? "tv" : "movie";
      res = await fetch(
        `${TMDB_BASE_URL}/${fallbackType}/${idStr}/images?api_key=${apiKey}&include_image_language=vi,en,null`,
        { next: { revalidate: 86400 * 7 } }
      );
      if (!res.ok) return null;
    }

    const data = await res.json();
    const logos: Array<{ file_path: string; iso_639_1?: string; vote_average?: number }> =
      data.logos || [];

    if (logos.length > 0) {
      // Prioritize Vietnamese logo, then English, then highest rated / first
      const viLogo = logos.find((l) => l.iso_639_1 === "vi");
      const enLogo = logos.find((l) => l.iso_639_1 === "en");
      const best = viLogo || enLogo || logos[0];

      if (best?.file_path) {
        const url = `${TMDB_IMAGE_ORIGINAL}${best.file_path}`;
        tmdbLogoCache.set(cacheKey, url);
        return url;
      }
    }
  } catch (error) {
    console.error(`[TMDB] Error fetching logo for ID ${tmdbId}:`, error);
  }

  return null;
}

