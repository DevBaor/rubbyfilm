import { NextRequest } from "next/server";
import { movieService } from "@/lib/services/movieService";
import { apiSuccess, apiError, handleRouteError } from "@/lib/server/apiResponse";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import { isValidSlug, parseBoundedInt } from "@/lib/server/validator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(`genre_${ip}`, 120, 60);

  if (!rateLimit.allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Please slow down.", 429, {
      "Retry-After": rateLimit.resetSeconds.toString(),
    });
  }

  try {
    const { slug } = await params;
    const cleanSlug = slug?.trim();

    if (!isValidSlug(cleanSlug)) {
      return apiError("INVALID_GENRE", "A valid genre slug is required", 400);
    }

    const { searchParams } = new URL(request.url);
    const page = parseBoundedInt(searchParams.get("page"), 1, 1, 500);
    const limit = parseBoundedInt(searchParams.get("limit"), 24, 1, 50);

    const result = await movieService.getMoviesByGenre(cleanSlug, { page, limit });

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
