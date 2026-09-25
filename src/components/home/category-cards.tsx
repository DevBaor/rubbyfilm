"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Movie } from "@/types/movie";

interface CategoryCardsProps {
  actionMovies?: Movie[];
  animeMovies?: Movie[];
  romanceMovies?: Movie[];
  seriesMovies?: Movie[];
  singleMovies?: Movie[];
}

const CINEMA_BACKUP_POSTER =
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80";

function PosterThumbnail({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#161616]">
      <Image
        src={imgSrc || CINEMA_BACKUP_POSTER}
        alt={alt}
        fill
        sizes="120px"
        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        onError={() => setImgSrc(CINEMA_BACKUP_POSTER)}
      />
    </div>
  );
}

export function CategoryCards({
  actionMovies = [],
  animeMovies = [],
  romanceMovies = [],
  seriesMovies = [],
  singleMovies = [],
}: CategoryCardsProps) {
  const getPosters = (list: Movie[], fallbackList: Movie[] = []) => {
    const combined = [...list, ...fallbackList];
    const urls = combined
      .map((m) => m?.posterUrl)
      .filter((url): url is string => Boolean(url && typeof url === "string" && url.trim().length > 0))
      .slice(0, 4);

    while (urls.length < 4) {
      urls.push(CINEMA_BACKUP_POSTER);
    }
    return urls;
  };

  const categories = [
    {
      title: "Phim Hành Động",
      href: "/genre/hanh-dong",
      count: "300+ Phim",
      posters: getPosters(actionMovies, singleMovies),
    },
    {
      title: "Hoạt Hình & Anime",
      href: "/genre/hoat-hinh",
      count: "250+ Phim",
      posters: getPosters(animeMovies, actionMovies),
    },
    {
      title: "Phim Tình Cảm",
      href: "/genre/tinh-cam",
      count: "220+ Phim",
      posters: getPosters(romanceMovies, singleMovies),
    },
    {
      title: "Phim Bộ Đặc Sắc",
      href: "/series",
      count: "500+ Phim",
      posters: getPosters(seriesMovies, actionMovies),
    },
    {
      title: "Phim Lẻ Chiếu Rạp",
      href: "/movies?type=single",
      count: "800+ Phim",
      posters: getPosters(singleMovies, actionMovies),
    },
  ];

  return (
    <section className="py-8 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1A1A1A] border border-[#262626] text-white text-xs font-semibold mb-2 shadow-sm">

              <span>DANH MỤC PHIM NỔI BẬT</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Khám Phá Theo Danh Mục Tuyển Chọn
            </h2>
          </div>

          <Link
            href="/movies"
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#CCCCCC] hover:text-[#E50000] transition-colors"
          >
            <span>Tất cả kho phim</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5-Column Grid of 4-Poster Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1C1C1C] to-[#121212] border border-[#282828] hover:border-[#E50000]/70 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(229,0,0,0.18)]"
            >
              {/* 2x2 Collage of Posters */}
              <div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden mb-3 relative bg-[#111111] shadow-inner">
                {cat.posters.slice(0, 4).map((src, idx) => (
                  <PosterThumbnail key={idx} src={src} alt={cat.title} />
                ))}
                {/* Subtle dark gradient overlay to unify the collage */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none opacity-80" />
              </div>

              {/* Title & Arrow */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#E50000] transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] text-[#777777] font-medium">
                    {cat.count}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#0F0F0F] border border-[#262626] flex items-center justify-center text-white group-hover:bg-[#E50000] group-hover:border-[#E50000] transition-all flex-shrink-0 shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
