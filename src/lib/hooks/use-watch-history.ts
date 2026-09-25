"use client";

import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/types/movie";
import { WatchHistoryItem, EpisodeWatchedState } from "@/types/user";
import { watchHistoryService } from "@/lib/services/watchHistoryService";

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial fetch from service
    setHistory(watchHistoryService.getHistory());
    setIsLoaded(true);

    // Subscribe to cross-component updates
    const unsubscribe = watchHistoryService.subscribe((updated) => {
      setHistory(updated);
    });

    return unsubscribe;
  }, []);

  const updateProgress = useCallback(
    (
      movie: Movie,
      progressSeconds: number,
      durationSeconds: number,
      episode?: { id: string; episodeNumber: number; name: string }
    ) => {
      watchHistoryService.updateProgress(movie, progressSeconds, durationSeconds, episode);
    },
    []
  );

  const removeFromHistory = useCallback((movieId: string) => {
    watchHistoryService.removeFromHistory(movieId);
  }, []);

  const clearHistory = useCallback(() => {
    watchHistoryService.clear();
  }, []);

  const getMovieProgress = useCallback(
    (movieId: string): WatchHistoryItem | undefined => {
      return watchHistoryService.getMovieProgress(movieId);
    },
    []
  );

  const getEpisodeProgress = useCallback(
    (movieId: string, episodeNumber: number): EpisodeWatchedState | undefined => {
      return watchHistoryService.getEpisodeProgress(movieId, episodeNumber);
    },
    []
  );

  const isEpisodeWatched = useCallback(
    (movieId: string, episodeNumber: number): boolean => {
      return watchHistoryService.isEpisodeWatched(movieId, episodeNumber);
    },
    []
  );

  const getRecentlyViewed = useCallback(
    (limit?: number): WatchHistoryItem[] => {
      return watchHistoryService.getRecentlyViewed(limit);
    },
    []
  );

  const getContinueWatching = useCallback(
    (limit?: number): WatchHistoryItem[] => {
      return watchHistoryService.getContinueWatching(limit);
    },
    []
  );

  return {
    history,
    isLoaded,
    updateProgress,
    removeFromHistory,
    clearHistory,
    getMovieProgress,
    getEpisodeProgress,
    isEpisodeWatched,
    getRecentlyViewed,
    getContinueWatching,
  };
}
