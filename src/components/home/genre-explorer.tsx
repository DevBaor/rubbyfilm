"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sword,
  Rocket,
  Wand2,
  Ghost,
  Heart,
  Laugh,
  Compass,
  Clapperboard,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { Genre } from "@/types/movie";

interface GenreExplorerProps {
  genres?: Genre[];
}

interface GenreCardMeta {
  slug: string;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderGlow: string;
}

const FEATURED_GENRES: GenreCardMeta[] = [
  {
    slug: "hanh-dong",
    name: "Hành Động",
    tagline: "Đối đầu kịch tính & nghẹt thở",
    icon: Sword,
    gradient: "from-red-600/25 via-orange-600/15 to-cinema-900/90",
    borderGlow: "hover:border-red-500/50 hover:shadow-red-500/10",
  },
  {
    slug: "vien-tuong",
    name: "Viễn Tưởng",
    tagline: "Khám phá vũ trụ & tương lai",
    icon: Rocket,
    gradient: "from-cyan-600/25 via-indigo-600/15 to-cinema-900/90",
    borderGlow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  {
    slug: "hoat-hinh",
    name: "Anime & Hoạt Họa",
    tagline: "Thế giới sắc màu sống động",
    icon: Wand2,
    gradient: "from-purple-600/25 via-fuchsia-600/15 to-cinema-900/90",
    borderGlow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    slug: "kinh-di",
    name: "Kinh Dị",
    tagline: "Ám ảnh & rùng rợn đến tột cùng",
    icon: Ghost,
    gradient: "from-rose-950/50 via-red-900/25 to-cinema-900/90",
    borderGlow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
  },
  {
    slug: "tinh-cam",
    name: "Tình Cảm",
    tagline: "Cung bậc cảm xúc lãng mạn",
    icon: Heart,
    gradient: "from-pink-600/25 via-rose-600/15 to-cinema-900/90",
    borderGlow: "hover:border-pink-500/50 hover:shadow-pink-500/10",
  },
  {
    slug: "hai-huoc",
    name: "Hài Hước",
    tagline: "Tiếng cười sảng khoái bất tận",
    icon: Laugh,
    gradient: "from-emerald-600/25 via-teal-600/15 to-cinema-900/90",
    borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    slug: "phieu-luu",
    name: "Phiêu Lưu",
    tagline: "Chinh phục những vùng đất mới",
    icon: Compass,
    gradient: "from-blue-600/25 via-sky-600/15 to-cinema-900/90",
    borderGlow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
  },
  {
    slug: "tam-ly",
    name: "Tâm Lý & Kịch Tính",
    tagline: "Chiều sâu nhân văn & nội tâm",
    icon: Clapperboard,
    gradient: "from-amber-600/25 via-yellow-600/15 to-cinema-900/90",
    borderGlow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  },
];

export function GenreExplorer({ genres = [] }: GenreExplorerProps) {
  return (
    <section className="py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Khám Phá Theo Thể Loại
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-cinema-400 mt-1 pl-10.5">
              Lựa chọn trải nghiệm điện ảnh phù hợp nhất với tâm trạng của bạn
            </p>
          </div>

          <Link
            href="/movies"
            className="text-xs sm:text-sm font-semibold text-cinema-300 hover:text-brand flex items-center gap-1 transition-colors"
          >
            <span>Tất cả thể loại</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {FEATURED_GENRES.map((g) => {
            const Icon = g.icon;
            // Match count if exists from API
            const matchedGenre = genres.find(
              (item) => item.slug === g.slug || item.slug.includes(g.slug)
            );

            return (
              <Link
                key={g.slug}
                href={`/genre/${g.slug}`}
                className={`group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${g.gradient} border border-white/[0.08] ${g.borderGlow} shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden flex flex-col justify-between min-h-[110px] sm:min-h-[130px]`}
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.08] transition-colors" />

                {/* Top Row: Icon + Arrow */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/[0.15] transition-all transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Row: Name + Tagline */}
                <div className="z-10 mt-3">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand transition-colors">
                    {g.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                    {g.tagline}
                  </p>
                  {matchedGenre?.count && (
                    <span className="inline-block mt-1 text-[10px] text-zinc-500 font-medium">
                      {matchedGenre.count} phim
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
