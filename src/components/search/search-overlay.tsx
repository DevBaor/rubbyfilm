"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Clock, ArrowRight, Star, Film, Loader2 } from "lucide-react";
import { Movie } from "@/types/movie";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useSearchHistory } from "@/lib/hooks/use-search-history";
import { Badge } from "@/components/ui/badge";
import { formatRating } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Movie[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useSearchHistory();

  const debouncedQuery = useDebounce(query, 250);

  // Fetch suggestions
  const [detectedPerson, setDetectedPerson] = React.useState<{
    name: string;
    roleTitle: string;
    role: string;
  } | null>(null);

  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setDetectedPerson(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setResults(Array.isArray(data.data) ? data.data : data.results || []);
          if (data.person) {
            setDetectedPerson(data.person);
          } else if (data.director) {
            setDetectedPerson({
              name: data.director.name,
              role: "director",
              roleTitle: "Đạo Diễn",
            });
          } else {
            setDetectedPerson(null);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Search suggestions error:", err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Keyboard escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center pt-16 sm:pt-24 px-4 bg-cinema-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl bg-cinema-900 border border-cinema-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-4 py-3.5 border-b border-cinema-800 bg-cinema-850/90"
        >
          <Search className="w-5 h-5 text-cinema-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm phim, diễn viên, thể loại..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-cinema-400 text-base outline-none"
          />
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-brand mr-2" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-cinema-400 hover:text-white mr-2"
              aria-label="Xóa"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-cinema-400 hover:text-white px-2 py-1 rounded bg-cinema-800 border border-cinema-700"
          >
            Esc
          </button>
        </form>

        {/* Content Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Query Results */}
          {query.trim() && (
            <div>
              <div className="flex items-center justify-between text-xs text-cinema-400 mb-2 px-1">
                <span className={detectedPerson ? "text-brand font-semibold" : ""}>
                  {detectedPerson
                    ? `${detectedPerson.role === "director" ? "🎬" : "🎭"} ${detectedPerson.roleTitle.toUpperCase()}: ${detectedPerson.name.toUpperCase()}`
                    : "GỢI Ý KẾT QUẢ"}
                </span>
                {results.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-brand hover:underline flex items-center gap-1"
                  >
                    <span>Xem tất cả kết quả</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-1.5">
                  {results.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.slug}`}
                      onClick={() => {
                        addRecentSearch(query);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-cinema-800 transition-colors group"
                    >
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-cinema-800">
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.srcset = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-brand transition-colors truncate">
                          {movie.title}
                        </h4>
                        <p className="text-xs text-cinema-400 truncate">
                          {movie.originalTitle} • {movie.year}
                        </p>
                      </div>
                      <Badge variant="rating" className="text-[11px] px-1.5 py-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{formatRating(movie.rating)}</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : !isLoading ? (
                <div className="py-8 text-center text-sm text-cinema-400">
                  <Film className="w-8 h-8 mx-auto text-cinema-600 mb-2" />
                  Không tìm thấy kết quả phù hợp cho &quot;{query}&quot;
                </div>
              ) : null}
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-cinema-400 mb-2 px-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand" />
                  <span>TÌM KIẾM GẦN ĐÂY</span>
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="hover:text-cinema-200 transition-colors"
                >
                  Xóa lịch sử
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectRecent(term)}
                    className="flex items-center gap-1.5 text-xs text-cinema-300 bg-cinema-800 hover:bg-cinema-750 hover:text-white border border-cinema-700/80 rounded-lg px-3 py-1.5 transition-colors group"
                  >
                    <span>{term}</span>
                    <span
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="hover:text-red-400 ml-1 text-cinema-500"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Suggestions */}
          {!query.trim() && (
            <div className="pt-2 border-t border-cinema-800">
              <span className="text-xs text-cinema-400 block mb-2 px-1">
                TỪ KHÓA PHỔ BIẾN
              </span>
              <div className="flex flex-wrap gap-2">
                {["Dune", "Oppenheimer", "Shogun", "Arcane", "Christopher Nolan", "Hành động"].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleSelectRecent(keyword)}
                    className="text-xs text-cinema-300 bg-cinema-850 hover:bg-cinema-800 hover:text-brand border border-cinema-800 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
