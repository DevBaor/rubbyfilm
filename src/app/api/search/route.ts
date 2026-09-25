import { NextRequest } from "next/server";
import { movieService } from "@/lib/services/movieService";
import { apiSuccess, apiError, handleRouteError } from "@/lib/server/apiResponse";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import { sanitizeSearchQuery, parseBoundedInt } from "@/lib/server/validator";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(`search_${ip}`, 80, 60);

  if (!rateLimit.allowed) {
    return apiError("RATE_LIMITED", "Too many search requests. Please slow down.", 429, {
      "Retry-After": rateLimit.resetSeconds.toString(),
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = sanitizeSearchQuery(searchParams.get("q"));
    const directorParam = sanitizeSearchQuery(searchParams.get("director"));
    const actorParam = sanitizeSearchQuery(searchParams.get("actor"));
    const personParam = sanitizeSearchQuery(searchParams.get("person"));
    const limit = parseBoundedInt(searchParams.get("limit"), 20, 1, 40);
    const page = parseBoundedInt(searchParams.get("page"), 1, 1, 100);

    const explicitPersonQuery = actorParam || directorParam || personParam;
    const explicitRole = actorParam ? "actor" : directorParam ? "director" : undefined;

    // 1. Explicit Actor/Director Search
    if (explicitPersonQuery) {
      const { personService } = await import("@/lib/server/personService");
      const result = await personService.searchPerson(explicitPersonQuery, explicitRole);
      if (result && result.movies.length > 0) {
        return apiSuccess(result.movies, {
          totalItems: result.movies.length,
          totalItemsPerPage: limit,
          currentPage: 1,
          totalPages: 1,
          person: result.person,
          director: result.person.role === "director" ? result.person : undefined,
        });
      }
    }

    // 2. Empty query returns empty array cleanly
    if (!query) {
      return apiSuccess([], {
        totalItems: 0,
        totalItemsPerPage: limit,
        currentPage: 1,
        totalPages: 0,
      });
    }

    if (query.length > 100) {
      return apiError("QUERY_TOO_LONG", "Search query cannot exceed 100 characters", 400);
    }

    // 3. Check if query is explicitly directed to actor or director
    if (/^(diễn viên|dien vien|đạo diễn|dao dien)\s+/i.test(query)) {
      const forcedRole = /^(diễn viên|dien vien)\s+/i.test(query) ? "actor" : "director";
      const { personService } = await import("@/lib/server/personService");
      const personResult = await personService.searchPerson(query, forcedRole);
      if (personResult && personResult.movies.length > 0) {
        return apiSuccess(personResult.movies, {
          totalItems: personResult.movies.length,
          totalItemsPerPage: limit,
          currentPage: 1,
          totalPages: 1,
          person: personResult.person,
          director: personResult.person.role === "director" ? personResult.person : undefined,
        });
      }
    }

    const { kkphimService } = await import("@/lib/server/kkphimService");
    const result = await kkphimService.searchMovies(query, page, limit);

    // 4. On page 1: Check if the query is a well-known actor or director
    if (page === 1) {
      const { personService } = await import("@/lib/server/personService");
      const personResult = await personService.searchPerson(query);
      if (personResult && personResult.movies.length > 0) {
        // If title search produced zero items or matches a known celebrity
        if (!result.items || result.items.length <= 2 || personResult.person.movieCount >= 3) {
          return apiSuccess(personResult.movies, {
            totalItems: personResult.movies.length,
            totalItemsPerPage: limit,
            currentPage: 1,
            totalPages: 1,
            person: personResult.person,
            director: personResult.person.role === "director" ? personResult.person : undefined,
          });
        }
      }
    }

    return apiSuccess(result.items, {
      totalItems: result.pagination.totalItems,
      totalItemsPerPage: result.pagination.totalItemsPerPage,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
