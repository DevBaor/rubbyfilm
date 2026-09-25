import {
  Movie,
  Genre,
  Country,
  MovieFilterOptions,
  PaginatedResult,
  HomeSectionsData,
} from "@/types/movie";
import { MovieDataProvider } from "./types";
import { MOCK_MOVIES, MOCK_GENRES, MOCK_COUNTRIES } from "@/lib/mock-data/movies";

export class MockMovieProvider implements MovieDataProvider {
  // Simulate network latency for realistic UX / skeletons if needed
  private async delay(ms: number = 30): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getHomeMovies(): Promise<HomeSectionsData> {
    await this.delay();
    const featured = MOCK_MOVIES.filter((m) => m.isHot || m.isRecommended).slice(0, 5);
    const latest = MOCK_MOVIES.filter((m) => m.isLatest);
    const hot = MOCK_MOVIES.filter((m) => m.isHot);
    const series = MOCK_MOVIES.filter((m) => m.type === "series");
    const singles = MOCK_MOVIES.filter((m) => m.type === "single");
    const tvShows = MOCK_MOVIES.filter((m) => m.type === "series");
    const action = MOCK_MOVIES.filter((m) => m.genreSlugs.includes("hanh-dong"));
    const romance = MOCK_MOVIES.filter((m) => m.genreSlugs.includes("tinh-cam"));
    const animation = MOCK_MOVIES.filter((m) => m.genreSlugs.includes("hoat-hinh"));
    const recommended = MOCK_MOVIES.filter((m) => m.isRecommended);

    return {
      featured,
      latest,
      hot,
      series,
      singles,
      tvShows,
      action,
      romance,
      animation,
      recommended,
    };
  }

  async getLatestMovies(limit: number = 10): Promise<Movie[]> {
    await this.delay();
    return MOCK_MOVIES.filter((m) => m.isLatest).slice(0, limit);
  }

  async getMovies(options?: MovieFilterOptions): Promise<PaginatedResult<Movie>> {
    await this.delay();
    let filtered = [...MOCK_MOVIES];

    if (options?.genre) {
      filtered = filtered.filter((m) =>
        m.genreSlugs.includes(options.genre!)
      );
    }

    if (options?.country) {
      filtered = filtered.filter((m) => m.countrySlug === options.country);
    }

    if (options?.year) {
      filtered = filtered.filter((m) => m.year === options.year);
    }

    if (options?.type) {
      filtered = filtered.filter((m) => m.type === options.type);
    }

    // Sorting
    const sort = options?.sort || "latest";
    filtered.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "views") return (b.views || 0) - (a.views || 0);
      if (sort === "year") return b.year - a.year;
      // Default latest
      return b.year - a.year || (b.isLatest ? 1 : 0) - (a.isLatest ? 1 : 0);
    });

    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 12);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getMovieBySlug(slug: string): Promise<Movie | null> {
    await this.delay();
    const movie = MOCK_MOVIES.find((m) => m.slug === slug);
    return movie || null;
  }

  async searchMovies(query: string, limit: number = 20): Promise<Movie[]> {
    await this.delay();
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return MOCK_MOVIES.filter((m) => {
      const titleMatch = m.title.toLowerCase().includes(q);
      const originalTitleMatch = m.originalTitle.toLowerCase().includes(q);
      const castMatch = m.cast?.some((c) => c.toLowerCase().includes(q));
      const directorMatch = m.director?.toLowerCase().includes(q);
      const genreMatch = m.genres.some((g) => g.toLowerCase().includes(q));

      return (
        titleMatch ||
        originalTitleMatch ||
        castMatch ||
        directorMatch ||
        genreMatch
      );
    }).slice(0, limit);
  }

  async getGenres(): Promise<Genre[]> {
    await this.delay();
    return MOCK_GENRES;
  }

  async getCountries(): Promise<Country[]> {
    await this.delay();
    return MOCK_COUNTRIES;
  }

  async getMoviesByGenre(
    genreSlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.getMovies({ ...options, genre: genreSlug });
  }

  async getMoviesByCountry(
    countrySlug: string,
    options?: MovieFilterOptions
  ): Promise<PaginatedResult<Movie>> {
    return this.getMovies({ ...options, country: countrySlug });
  }

  async getRelatedMovies(slug: string, limit: number = 6): Promise<Movie[]> {
    await this.delay();
    const current = MOCK_MOVIES.find((m) => m.slug === slug);
    if (!current) return MOCK_MOVIES.slice(0, limit);

    // Filter by same genre or country, excluding current movie
    const related = MOCK_MOVIES.filter(
      (m) =>
        m.slug !== slug &&
        (m.genreSlugs.some((g) => current.genreSlugs.includes(g)) ||
          m.countrySlug === current.countrySlug)
    );

    return related.slice(0, limit);
  }
}
