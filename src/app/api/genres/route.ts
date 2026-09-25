import { NextRequest } from "next/server";
import { movieService } from "@/lib/services/movieService";
import { apiSuccess, apiError, handleRouteError } from "@/lib/server/apiResponse";
import { checkRateLimit } from "@/lib/server/rateLimiter";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(`genres_all_${ip}`, 120, 60);

  if (!rateLimit.allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Please slow down.", 429, {
      "Retry-After": rateLimit.resetSeconds.toString(),
    });
  }

  try {
    const genres = await movieService.getGenres();
    return apiSuccess(genres);
  } catch (error) {
    return handleRouteError(error);
  }
}
