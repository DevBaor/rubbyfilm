import { Episode } from "@/types/movie";

/**
 * Normalizes and formats episode subtitle to prevent redundant duplicates
 * like "Tập 1" on top and "Tập 01" underneath.
 */
export function getEpisodeSubtitle(ep: {
  name?: string;
  episodeNumber: number;
  duration?: string;
}): string {
  if (!ep || !ep.name) {
    return ep?.duration || "Full HD";
  }

  // Strip away prefixes like "Tập 01", "Tập 1", "Tap 01", "Episode 1", etc.
  const cleaned = ep.name
    .replace(/^Tập\s*0*\d+\s*[:\-–]?\s*/i, "")
    .replace(/^Tap\s*0*\d+\s*[:\-–]?\s*/i, "")
    .replace(/^Episode\s*0*\d+\s*[:\-–]?\s*/i, "")
    .replace(/^Ep\.?\s*0*\d+\s*[:\-–]?\s*/i, "")
    .replace(/^0*\d+$/, "")
    .trim();

  // If there is an actual unique title (e.g. "Khởi đầu", "Hỗn loạn", etc.)
  if (
    cleaned &&
    cleaned.toLowerCase() !== `tập ${ep.episodeNumber}` &&
    cleaned.toLowerCase() !== `tập 0${ep.episodeNumber}`
  ) {
    return cleaned;
  }

  // Fallback to duration or quality tag (never repeat the episode number)
  if (ep.duration && !ep.duration.toLowerCase().includes("tập")) {
    return ep.duration;
  }

  return "Full HD";
}
