import { MovieDataProvider } from "./types";
import { MockMovieProvider } from "./mock-provider";
import { KkphimProvider } from "./kkphim-provider";

export function createMovieProvider(): MovieDataProvider {
  const provider = process.env.MOVIE_PROVIDER?.toLowerCase() || "kkphim";
  if (provider === "mock") {
    return new MockMovieProvider();
  }
  return new KkphimProvider();
}

export const movieProvider: MovieDataProvider = createMovieProvider();

export * from "./types";
export { MockMovieProvider } from "./mock-provider";
export { KkphimProvider } from "./kkphim-provider";
