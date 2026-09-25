import { Movie } from "@/types/movie";
import { WatchHistoryItem, EpisodeWatchedState } from "@/types/user";

export interface IWatchHistoryService {
  getHistory(): WatchHistoryItem[];
  getRecentlyViewed(limit?: number): WatchHistoryItem[];
  getContinueWatching(limit?: number): WatchHistoryItem[];
  updateProgress(
    movie: Movie,
    progressSeconds: number,
    durationSeconds: number,
    episode?: { id: string; episodeNumber: number; name: string }
  ): void;
  removeFromHistory(movieId: string): void;
  clear(): void;
  getMovieProgress(movieId: string): WatchHistoryItem | undefined;
  getEpisodeProgress(movieId: string, episodeNumber: number): EpisodeWatchedState | undefined;
  isEpisodeWatched(movieId: string, episodeNumber: number): boolean;
  subscribe(callback: (history: WatchHistoryItem[]) => void): () => void;
}

const PRIMARY_KEY = "rubbyfilm_watch_history";
const LEGACY_KEY = "bfilm_watch_history";

class WatchHistoryService implements IWatchHistoryService {
  private cache: WatchHistoryItem[] | null = null;
  private listeners: Set<(history: WatchHistoryItem[]) => void> = new Set();
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Clean up unisolated legacy keys so old shared data never leaks
        localStorage.removeItem(PRIMARY_KEY);
        localStorage.removeItem(LEGACY_KEY);

        const cached = localStorage.getItem("rubbyfilm_cached_user");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.id) {
            this.currentUserId = String(parsed.id).trim();
          }
        }
      } catch {}
    }
  }

  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  public setUser(userId: string | null): void {
    const normalized = userId ? String(userId).trim() : null;
    if (this.currentUserId === normalized) return;
    this.currentUserId = normalized;
    this.cache = null;
    this.notify();
  }

  private getStorageKey(): string | null {
    if (!this.currentUserId) return null;
    return `rubbyfilm_watch_history_${this.currentUserId}`;
  }

  private load(): WatchHistoryItem[] {
    if (!this.isClient()) return [];
    if (!this.currentUserId) {
      this.cache = [];
      return [];
    }
    if (this.cache !== null) return this.cache;

    try {
      const key = this.getStorageKey();
      if (!key) {
        this.cache = [];
        return [];
      }

      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          const deduplicated: WatchHistoryItem[] = [];
          for (const item of parsed) {
            const id = item?.movieId || item?.movie?.id || item?.slug;
            if (id && !seen.has(String(id))) {
              seen.add(String(id));
              deduplicated.push(item);
            }
          }
          this.cache = deduplicated;
          return this.cache;
        }
      }
    } catch (e) {
      console.error("[WatchHistoryService] Failed to parse storage:", e);
    }

    this.cache = [];
    return this.cache;
  }

  private save(items: WatchHistoryItem[]): void {
    this.cache = items;
    if (this.isClient() && this.currentUserId) {
      try {
        const key = this.getStorageKey();
        if (key) {
          localStorage.setItem(key, JSON.stringify(items));
        }
      } catch (e) {
        console.error("[WatchHistoryService] Failed to write storage:", e);
      }
    }
    this.notify();
  }

  private notify(): void {
    const history = this.getHistory();
    this.listeners.forEach((fn) => {
      try {
        fn(history);
      } catch (e) {
        console.error("[WatchHistoryService] Listener error:", e);
      }
    });
  }

  public getHistory(): WatchHistoryItem[] {
    return [...this.load()];
  }

  public getRecentlyViewed(limit: number = 10): WatchHistoryItem[] {
    return this.load().slice(0, limit);
  }

  public getContinueWatching(limit: number = 10): WatchHistoryItem[] {
    // Movies that are in progress (> 10s and not completed)
    return this.load()
      .filter((item) => item.progressSeconds > 10 && !item.completed)
      .slice(0, limit);
  }

  public updateProgress(
    movie: Movie,
    progressSeconds: number,
    durationSeconds: number,
    episode?: { id: string; episodeNumber: number; name: string }
  ): void {
    if (!durationSeconds || durationSeconds <= 0) return;
    const progressPercent = Math.min(100, Math.round((progressSeconds / durationSeconds) * 100));
    const epNum = episode?.episodeNumber ?? 1;
    const isCompleted = progressPercent >= 90;

    const currentList = this.load();
    const existing = currentList.find((item) => item.movieId === movie.id);
    const filtered = currentList.filter((item) => item.movieId !== movie.id);

    const existingWatched = existing?.watchedEpisodes || {};
    const updatedWatched: Record<number, EpisodeWatchedState> = {
      ...existingWatched,
      [epNum]: {
        progressSeconds: Math.round(progressSeconds),
        durationSeconds: Math.round(durationSeconds),
        progressPercent,
        completed: isCompleted || Boolean(existingWatched[epNum]?.completed),
        watchedAt: Date.now(),
      },
    };

    const newItem: WatchHistoryItem = {
      movieId: movie.id,
      slug: movie.slug,
      title: movie.title,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      movie,
      episodeId: episode?.id,
      episodeNumber: episode?.episodeNumber,
      episodeName: episode?.name,
      progressSeconds: Math.round(progressSeconds),
      durationSeconds: Math.round(durationSeconds),
      progressPercent,
      watchedAt: Date.now(),
      completed: isCompleted,
      watchedEpisodes: updatedWatched,
    };

    const updated = [newItem, ...filtered].slice(0, 50);
    this.save(updated);
  }

  public removeFromHistory(movieIdOrSlug: string): void {
    if (!movieIdOrSlug) return;
    const target = String(movieIdOrSlug).trim().toLowerCase();
    const current = this.load();
    const updated = current.filter((item) => {
      const id = String(item.movieId || item.movie?.id || "").trim().toLowerCase();
      const slug = String(item.slug || item.movie?.slug || "").trim().toLowerCase();
      return id !== target && slug !== target;
    });
    this.save(updated);
  }

  public clear(): void {
    this.save([]);
    if (this.isClient() && this.currentUserId) {
      try {
        const key = this.getStorageKey();
        if (key) localStorage.removeItem(key);
      } catch {}
    }
  }

  public getMovieProgress(movieId: string): WatchHistoryItem | undefined {
    return this.load().find((item) => item.movieId === movieId);
  }

  public getEpisodeProgress(
    movieId: string,
    episodeNumber: number
  ): EpisodeWatchedState | undefined {
    const item = this.getMovieProgress(movieId);
    if (!item?.watchedEpisodes) return undefined;
    return item.watchedEpisodes[episodeNumber];
  }

  public isEpisodeWatched(movieId: string, episodeNumber: number): boolean {
    const ep = this.getEpisodeProgress(movieId, episodeNumber);
    if (ep?.completed) return true;
    if (ep && ep.progressPercent >= 85) return true;
    return false;
  }

  public subscribe(callback: (history: WatchHistoryItem[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const watchHistoryService = new WatchHistoryService();
