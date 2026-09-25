const SAFE_SLUG_REGEX = /^[a-zA-Z0-9_\-]+$/;
const SAFE_FILTER_REGEX = /^[a-zA-Z0-9_\-\s]+$/;

/**
 * Validates whether a slug is safe (alphanumeric, hyphens, underscores only)
 */
export function isValidSlug(slug: string | null | undefined): slug is string {
  if (!slug || typeof slug !== "string") return false;
  const trimmed = slug.trim();
  if (trimmed.length < 1 || trimmed.length > 120) return false;
  return SAFE_SLUG_REGEX.test(trimmed);
}

/**
 * Sanitizes search queries by stripping control characters and trimming
 */
export function sanitizeSearchQuery(query: string | null | undefined): string {
  if (!query || typeof query !== "string") return "";
  // Strip control characters (ASCII 0-31 and 127)
  const cleaned = query.replace(/[\x00-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, 100);
}

/**
 * Validates and sanitizes a filter string (genre, country, quality)
 */
export function sanitizeFilterString(val: string | null | undefined, maxLength: number = 50): string | undefined {
  if (!val || typeof val !== "string") return undefined;
  const trimmed = val.trim();
  if (!trimmed || trimmed.length > maxLength) return undefined;
  if (!SAFE_FILTER_REGEX.test(trimmed)) return undefined;
  return trimmed;
}

/**
 * Safely parses and bounds an integer
 */
export function parseBoundedInt(
  val: string | null | undefined,
  defaultVal: number,
  min: number,
  max: number
): number {
  if (!val) return defaultVal;
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) return defaultVal;
  return Math.min(Math.max(parsed, min), max);
}

/**
 * Safely parses and bounds a float rating
 */
export function parseBoundedRating(
  val: string | null | undefined,
  min: number = 0,
  max: number = 10
): number | undefined {
  if (!val) return undefined;
  const parsed = parseFloat(val);
  if (isNaN(parsed)) return undefined;
  return Math.min(Math.max(parsed, min), max);
}
