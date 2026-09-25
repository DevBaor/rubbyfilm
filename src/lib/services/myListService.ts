import { Movie } from "@/types/movie";

export interface IMyListService {
  getList(): Movie[];
  add(movie: Movie): void;
  remove(movieId: string): void;
  toggle(movie: Movie): boolean;
  has(movieId: string): boolean;
  clear(): void;
  subscribe(callback: (list: Movie[]) => void): () => void;
  setUser(userId: string | null): void;
}

const PRIMARY_KEY = "rubbyfilm_my_list";
const LEGACY_KEY = "bfilm_my_list";

class MyListService implements IMyListService {
  private cache: Movie[] | null = null;
  private listeners: Set<(list: Movie[]) => void> = new Set();
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Clean up legacy non-user keys
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
    return `rubbyfilm_my_list_${this.currentUserId}`;
  }

  private load(): Movie[] {
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
          this.cache = parsed;
          return this.cache;
        }
      }
    } catch (e) {
      console.error("[MyListService] Failed to parse storage:", e);
    }

    this.cache = [];
    return this.cache;
  }

  private save(items: Movie[]): void {
    this.cache = items;
    if (this.isClient() && this.currentUserId) {
      try {
        const key = this.getStorageKey();
        if (key) {
          localStorage.setItem(key, JSON.stringify(items));
        }
      } catch (e) {
        console.error("[MyListService] Failed to write storage:", e);
      }
    }
    this.notify();
  }

  private notify(): void {
    const list = this.getList();
    this.listeners.forEach((fn) => {
      try {
        fn(list);
      } catch (e) {
        console.error("[MyListService] Listener error:", e);
      }
    });
  }

  public getList(): Movie[] {
    return [...this.load()];
  }

  public has(movieId: string): boolean {
    return this.load().some((m) => m.id === movieId);
  }

  public add(movie: Movie): void {
    if (!this.currentUserId) return;
    const current = this.load();
    if (current.some((m) => m.id === movie.id)) return;
    const updated = [movie, ...current];
    this.save(updated);
  }

  public remove(movieId: string): void {
    if (!this.currentUserId) return;
    const current = this.load();
    const updated = current.filter((m) => m.id !== movieId);
    this.save(updated);
  }

  public toggle(movie: Movie): boolean {
    if (!this.currentUserId) return false;
    if (this.has(movie.id)) {
      this.remove(movie.id);
      return false;
    } else {
      this.add(movie);
      return true;
    }
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

  public subscribe(callback: (list: Movie[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const myListService = new MyListService();
