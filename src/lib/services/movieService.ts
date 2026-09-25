import { MovieDataProvider } from "@/lib/providers/types";
import { MockMovieProvider } from "@/lib/providers/mock-provider";
import { KkphimProvider } from "@/lib/providers/kkphim-provider";
import {
  Movie,
  Genre,
  Country,
  MovieFilterOptions,
  PaginatedResult,
  HomeSectionsData,
} from "@/types/movie";

class MovieService {
  private provider: MovieDataProvider;

  constructor() {
    const providerType = process.env.MOVIE_PROVIDER?.toLowerCase() || "kkphim";

    if (providerType === "mock") {
      this.provider = new MockMovieProvider();
    } else {
      this.provider = new KkphimProvider();
    }
  }

  public getProvider(): MovieDataProvider {
    return this.provider;
  }

  async getHomeMovies(): Promise<HomeSectionsData> {
    return this.provider.getHomeMovies();
  }

  async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    return this.provider.getLatestMovies(limit);
  }

  async getMovies(options?: MovieFilterOptions): Promise<PaginatedResult<Movie>> {
    return this.provider.getMovies(options);
  }

  async getMovieBySlug(slug: string): Promise<Movie | null> {
    return this.provider.getMovieBySlug(slug);
  }

  async searchMovies(query: string, limit: number = 20): Promise<Movie[]> {
    return this.provider.searchMovies(query, limit);
  }

  async getGenres(): Promise<Genre[]> {
    return this.provider.getGenres();
  }

  async getCountries(): Promise<Country[]> {
    return this.provider.getCountries();
  }

  async getMoviesByGenre(
    genreSlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.provider.getMoviesByGenre(genreSlug, options);
  }

  async getMoviesByCountry(
    countrySlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.provider.getMoviesByCountry(countrySlug, options);
  }

  async getRelatedMovies(slug: string, limit: number = 6): Promise<Movie[]> {
    return this.provider.getRelatedMovies(slug, limit);
  }
}

export const movieService = new MovieService();
