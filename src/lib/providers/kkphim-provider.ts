import { cache } from "react";
import { MovieDataProvider } from "./types";
import { kkphimService } from "@/lib/server/kkphimService";
import {
  Movie,
  Genre,
  Country,
  MovieFilterOptions,
  PaginatedResult,
  HomeSectionsData,
} from "@/types/movie";

// Memoized functions for server-render pass deduplication
const memoizedGetHomeMovies = cache(async (): Promise<HomeSectionsData> => {
  return kkphimService.getHomeMovies();
});

const memoizedGetMovieBySlug = cache(async (slug: string): Promise<Movie | null> => {
  return kkphimService.getMovieBySlug(slug);
});

const memoizedGetGenres = cache(async (): Promise<Genre[]> => {
  return kkphimService.getGenres();
});

const memoizedGetCountries = cache(async (): Promise<Country[]> => {
  return kkphimService.getCountries();
});

export class KkphimProvider implements MovieDataProvider {
  async getHomeMovies(): Promise<HomeSectionsData> {
    return memoizedGetHomeMovies();
  }

  async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    const res = await kkphimService.getLatestMovies(1);
    return res.items.slice(0, limit);
  }

  async getMovies(options?: MovieFilterOptions): Promise<PaginatedResult<Movie>> {
    const res = await kkphimService.queryMovies(options);
    return {
      items: res.items,
      total: res.pagination.totalItems,
      page: res.pagination.currentPage,
      limit: res.pagination.totalItemsPerPage,
      totalPages: res.pagination.totalPages,
    };
  }

  async getMovieBySlug(slug: string): Promise<Movie | null> {
    return memoizedGetMovieBySlug(slug);
  }

  async searchMovies(query: string, limit: number = 20): Promise<Movie[]> {
    const res = await kkphimService.searchMovies(query, 1, limit);
    return res.items.slice(0, limit);
  }

  async getGenres(): Promise<Genre[]> {
    return memoizedGetGenres();
  }

  async getCountries(): Promise<Country[]> {
    return memoizedGetCountries();
  }

  async getMoviesByGenre(
    genreSlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.getMovies({
      ...options,
      genre: genreSlug,
    });
  }

  async getMoviesByCountry(
    countrySlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.getMovies({
      ...options,
      country: countrySlug,
    });
  }

  async getRelatedMovies(slug: string, limit: number = 6): Promise<Movie[]> {
    try {
      const current = await this.getMovieBySlug(slug);
      if (current && current.genreSlugs.length > 0) {
        const relatedRes = await kkphimService.getMoviesByGenre(current.genreSlugs[0], 1, limit + 2);
        return relatedRes.items.filter((m) => m.slug !== slug).slice(0, limit);
      }
      const latest = await this.getLatestMovies(limit + 1);
      return latest.filter((m) => m.slug !== slug).slice(0, limit);
    } catch {
      return [];
    }
  }
}
