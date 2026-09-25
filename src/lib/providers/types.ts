import {
  Movie,
  Genre,
  Country,
  MovieFilterOptions,
  PaginatedResult,
  HomeSectionsData,
} from "@/types/movie";

export interface MovieDataProvider {
  getHomeMovies(): Promise<HomeSectionsData>;
  getLatestMovies(limit?: number): Promise<Movie[]>;
  getMovies(options?: MovieFilterOptions): Promise<PaginatedResult<Movie>>;
  getMovieBySlug(slug: string): Promise<Movie | null>;
  searchMovies(query: string, limit?: number): Promise<Movie[]>;
  getGenres(): Promise<Genre[]>;
  getCountries(): Promise<Country[]>;
  getMoviesByGenre(
    genreSlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>>;
  getMoviesByCountry(
    countrySlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>>;
  getRelatedMovies(slug: string, limit?: number): Promise<Movie[]>;
}
