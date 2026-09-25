"use client";

import * as React from "react";
import { Episode } from "@/types/movie";
import { Play, CheckCircle2, Tv, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/lib/hooks/use-watch-history";
import { getEpisodeSubtitle } from "@/lib/utils/episode";

interface EpisodeSelectorProps {
  movieId: string;
  episodes: Episode[];
  activeEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  className?: string;
}

export function EpisodeSelector({
  movieId,
  episodes,
  activeEpisodeId,
  onSelectEpisode,
  className,
}: EpisodeSelectorProps) {
  const { isEpisodeWatched, getEpisodeProgress } = useWatchHistory();
  const [selectedSeason, setSelectedSeason] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Group into seasons or chunks if long series
  const seasonGroups = React.useMemo(() => {
    if (!episodes || episodes.length === 0) return [];

    const seasonMap = new Map<number, Episode[]>();
    episodes.forEach((ep) => {
      const s = ep.seasonNumber || 1;
      if (!seasonMap.has(s)) seasonMap.set(s, []);
      seasonMap.get(s)!.push(ep);
    });

    if (seasonMap.size > 1) {
      return Array.from(seasonMap.entries()).map(([seasonNum, eps]) => ({
        id: seasonNum,
        name: `Mùa ${seasonNum}`,
        episodes: eps,
      }));
    }

    if (episodes.length > 40) {
      const chunkSize = 30;
      const chunks = [];
      for (let i = 0; i < episodes.length; i += chunkSize) {
        const chunkEps = episodes.slice(i, i + chunkSize);
        const startEp = chunkEps[0].episodeNumber;
        const endEp = chunkEps[chunkEps.length - 1].episodeNumber;
        chunks.push({
          id: Math.floor(i / chunkSize) + 1,
          name: `Tập ${startEp} - ${endEp}`,
          episodes: chunkEps,
        });
      }
      return chunks;
    }

    return [
      {
        id: 1,
        name: "Mùa 1",
        episodes: episodes,
      },
    ];
  }, [episodes]);

  if (!episodes || episodes.length === 0) return null;

  const currentGroupEpisodes =
    seasonGroups.find((g) => g.id === selectedSeason)?.episodes || episodes;

  // Filter episodes if user types search query (e.g. "5" or "tập 5" or name)
  const filteredEpisodes = searchQuery.trim()
    ? episodes.filter((ep) => {
        const query = searchQuery.trim().toLowerCase();
        const numStr = String(ep.episodeNumber);
        return (
          numStr === query ||
          ep.name.toLowerCase().includes(query) ||
          `tập ${numStr}`.includes(query)
        );
      })
    : currentGroupEpisodes;

  return (
    <div className={cn("p-5 rounded-2xl bg-cinema-850/80 border border-cinema-700/60 shadow-lg", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-cinema-750">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-brand" />
            <span>Danh Sách Tập</span>
            <span className="text-xs text-cinema-400 font-normal">({episodes.length} tập)</span>
          </h3>

          {/* Quick Search Episode */}
          <div className="relative w-36 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-cinema-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm số tập..."
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg pl-8 pr-7 py-1 text-xs text-white placeholder-cinema-500 focus:outline-none focus:border-brand"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-cinema-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Season Groups Tabs (only if not searching) */}
        {!searchQuery && seasonGroups.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {seasonGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedSeason(group.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                  selectedSeason === group.id
                    ? "bg-brand text-cinema-950 border-brand font-bold"
                    : "bg-cinema-800 text-cinema-300 border-cinema-700 hover:bg-cinema-700 hover:text-white"
                )}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Episode Cards */}
      {filteredEpisodes.length === 0 ? (
        <div className="py-8 text-center text-xs text-cinema-400">
          Không tìm thấy tập nào khớp với &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredEpisodes.map((ep) => {
            const isActive = ep.id === activeEpisodeId;
            const isWatched = isEpisodeWatched(movieId, ep.episodeNumber);
            const progress = getEpisodeProgress(movieId, ep.episodeNumber);

            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => onSelectEpisode(ep)}
                className={cn(
                  "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 select-none overflow-hidden group/item",
                  isActive
                    ? "bg-brand text-cinema-950 font-bold border-brand shadow-md shadow-brand/20 scale-[1.02]"
                    : "bg-cinema-800 text-cinema-200 border-cinema-700/80 hover:bg-cinema-750 hover:text-white hover:border-cinema-500"
                )}
              >
                {/* Ep header: Ep number + Watched state */}
                <div className="flex items-center justify-between gap-1 w-full">
                  <div className="flex items-center gap-1">
                    {isActive && <Play className="w-3 h-3 fill-current flex-shrink-0" />}
                    <span className="text-xs font-bold truncate">Tập {ep.episodeNumber}</span>
                  </div>

                  {isWatched && !isActive && (
                    <span className="text-emerald-400" title="Đã xem">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Name or duration */}
                <span
                  className={cn(
                    "text-[10px] line-clamp-1 mt-0.5",
                    isActive ? "text-cinema-900 font-semibold" : "text-cinema-400"
                  )}
                >
                  {getEpisodeSubtitle(ep)}
                </span>

                {/* Progress bar if partially watched */}
                {progress && progress.progressPercent > 0 && !progress.completed && !isActive && (
                  <div className="w-full bg-cinema-700 h-1 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-brand h-full rounded-full"
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
