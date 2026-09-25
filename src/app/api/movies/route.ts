import { NextRequest } from "next/server";
import { movieService } from "@/lib/services/movieService";
import { apiSuccess, apiError, handleRouteError } from "@/lib/server/apiResponse";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import { MovieType } from "@/types/movie";

import {
  sanitizeFilterString,
  parseBoundedInt,
  parseBoundedRating,
} from "@/lib/server/validator";

export async function GET(request: NextRequest) {
  // Rate limiting per IP or default identifier
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(`movies_${ip}`, 120, 60);

  if (!rateLimit.allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Please slow down.", 429, {
      "Retry-After": rateLimit.resetSeconds.toString(),
    });
  }

  try {
    const { searchParams } = new URL(request.url);

    const genre = sanitizeFilterString(searchParams.get("genre"));
    const country = sanitizeFilterString(searchParams.get("country"));
    const quality = sanitizeFilterString(searchParams.get("quality"));

    const typeParam = searchParams.get("type")?.trim();
    const type = typeParam === "single" || typeParam === "series" ? (typeParam as MovieType) : undefined;

    const rawSort = searchParams.get("sort")?.trim();
    const validSorts = ["latest", "rating", "views", "year", "alpha"] as const;
    const sort = validSorts.includes(rawSort as any) ? (rawSort as typeof validSorts[number]) : "latest";

    const year = parseBoundedInt(searchParams.get("year"), 0, 1900, 2100) || undefined;
    const rating = parseBoundedRating(searchParams.get("rating"), 0, 10);

    const page = parseBoundedInt(searchParams.get("page"), 1, 1, 500);
    const limit = parseBoundedInt(searchParams.get("limit"), 24, 1, 50);

    const result = await movieService.getMovies({
      genre,
      country,
      type,
      year,
      rating,
      quality,
      sort,
      page,
      limit,
    });

    return apiSuccess(result.items, {
      totalItems: result.total,
      totalItemsPerPage: result.limit,
      currentPage: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
