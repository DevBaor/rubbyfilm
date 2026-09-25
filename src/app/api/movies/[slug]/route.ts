import { NextRequest } from "next/server";
import { movieService } from "@/lib/services/movieService";
import { apiSuccess, apiError, handleRouteError } from "@/lib/server/apiResponse";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import { isValidSlug } from "@/lib/server/validator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(`detail_${ip}`, 180, 60);

  if (!rateLimit.allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Please slow down.", 429, {
      "Retry-After": rateLimit.resetSeconds.toString(),
    });
  }

  try {
    const { slug } = await params;
    const cleanSlug = slug?.trim();

    if (!isValidSlug(cleanSlug)) {
      return apiError("INVALID_SLUG", "A valid movie slug is required (alphanumeric, hyphens)", 400);
    }

    const movie = await movieService.getMovieBySlug(cleanSlug);

    if (!movie) {
      return apiError("MOVIE_NOT_FOUND", `Movie with slug '${cleanSlug}' was not found`, 404);
    }

    const related = await movieService.getRelatedMovies(cleanSlug, 6);

    return apiSuccess({
      movie,
      related,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
