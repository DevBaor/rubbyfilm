"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Sparkles,
  Flame,
  Film,
  Award,
  Clock,
  History,
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface YearCardItem {
  year: number | string;
  href: string;
  tag: string;
  tagIcon: LucideIcon;
  watermarkIcon: LucideIcon;
  title: string;
  subtitle: string;
  highlight?: boolean;
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  glowColor: string;
  tagColorClass: string;
  bgImage?: string;
}

const FEATURED_YEARS: YearCardItem[] = [
  {
    year: 2026,
    href: "/year/2026",
    tag: "SIÊU HOT 2026",
    tagIcon: Sparkles,
    watermarkIcon: Flame,
    title: "Điện Ảnh 2026",
    subtitle: "Khởi chiếu rạp mới nhất",
    highlight: true,
    gradient: "linear-gradient(135deg, rgba(229, 0, 0, 0.45) 0%, rgba(20, 8, 8, 0.98) 80%)",
    borderColor: "rgba(229, 0, 0, 0.35)",
    hoverBorder: "rgba(229, 0, 0, 0.8)",
    glowColor: "rgba(229, 0, 0, 0.35)",
    tagColorClass: "text-[#FECF59] bg-[#E50000]/30 border-[#FECF59]/40 font-black",
    bgImage: "https://image.tmdb.org/t/p/w780/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
  },
  {
    year: 2025,
    href: "/year/2025",
    tag: "BOM TẤN",
    tagIcon: Flame,
    watermarkIcon: Film,
    title: "Điện Ảnh 2025",
    subtitle: "Cơn sốt phòng vé toàn cầu",
    gradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(20, 10, 8, 0.96) 80%)",
    borderColor: "rgba(234, 88, 12, 0.25)",
    hoverBorder: "rgba(234, 88, 12, 0.65)",
    glowColor: "rgba(234, 88, 12, 0.25)",
    tagColorClass: "text-orange-300 bg-orange-500/15 border-orange-500/30",
    bgImage: "https://image.tmdb.org/t/p/w780/kJsPVzdyBrYHLomuNv5SJDXUQ2f.jpg",
  },
  {
    year: 2024,
    href: "/year/2024",
    tag: "ĐẶC SẮC",
    tagIcon: Award,
    watermarkIcon: Award,
    title: "Điện Ảnh 2024",
    subtitle: "Những tác phẩm đột phá",
    gradient: "linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(18, 10, 24, 0.96) 80%)",
    borderColor: "rgba(147, 51, 234, 0.25)",
    hoverBorder: "rgba(147, 51, 234, 0.65)",
    glowColor: "rgba(147, 51, 234, 0.25)",
    tagColorClass: "text-purple-300 bg-purple-500/15 border-purple-500/30",
    bgImage: "https://image.tmdb.org/t/p/w780/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
  },
  {
    year: 2023,
    href: "/year/2023",
    tag: "TUYỂN CHỌN",
    tagIcon: Film,
    watermarkIcon: Clock,
    title: "Điện Ảnh 2023",
    subtitle: "Tác phẩm ghi dấu ấn",
    gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.4) 0%, rgba(10, 14, 26, 0.96) 80%)",
    borderColor: "rgba(37, 99, 235, 0.25)",
    hoverBorder: "rgba(37, 99, 235, 0.65)",
    glowColor: "rgba(37, 99, 235, 0.25)",
    tagColorClass: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    bgImage: "https://image.tmdb.org/t/p/w780/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
  },
  {
    year: 2022,
    href: "/year/2022",
    tag: "ĂN KHÁCH",
    tagIcon: Clock,
    watermarkIcon: History,
    title: "Điện Ảnh 2022",
    subtitle: "Kịch tính & giàu cảm xúc",
    gradient: "linear-gradient(135deg, rgba(13, 148, 136, 0.4) 0%, rgba(8, 20, 18, 0.96) 80%)",
    borderColor: "rgba(13, 148, 136, 0.25)",
    hoverBorder: "rgba(13, 148, 136, 0.65)",
    glowColor: "rgba(13, 148, 136, 0.25)",
    tagColorClass: "text-teal-300 bg-teal-500/15 border-teal-500/30",
    bgImage: "https://image.tmdb.org/t/p/w780/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
  },
  {
    year: "kinh-dien",
    href: "/movies?sort=year_asc&type=single",
    tag: "KINH ĐIỂN",
    tagIcon: History,
    watermarkIcon: Award,
    title: "Phim Kinh Điển",
    subtitle: "Những kiệt tác bất hủ",
    gradient: "linear-gradient(135deg, rgba(202, 138, 4, 0.4) 0%, rgba(24, 18, 8, 0.96) 80%)",
    borderColor: "rgba(202, 138, 4, 0.25)",
    hoverBorder: "rgba(202, 138, 4, 0.65)",
    glowColor: "rgba(202, 138, 4, 0.25)",
    tagColorClass: "text-amber-300 bg-amber-500/15 border-amber-500/30",
    bgImage: "https://image.tmdb.org/t/p/w780/xXCuto8YVp5RFqBJ7yKmVmLOWpF.jpg",
  },
];

const QUICK_YEARS = [
  { label: "2026", href: "/year/2026", hot: true },
  { label: "2025", href: "/year/2025" },
  { label: "2024", href: "/year/2024" },
  { label: "2023", href: "/year/2023" },
  { label: "2022", href: "/year/2022" },
  { label: "2021", href: "/year/2021" },
  { label: "2020", href: "/year/2020" },
  { label: "2019", href: "/year/2019" },
  { label: "2018", href: "/year/2018" },
  { label: "2017", href: "/year/2017" },
  { label: "2016", href: "/year/2016" },
  { label: "2015", href: "/year/2015" },
  { label: "2010", href: "/year/2010" },
];

export function YearDiscovery() {
  return (
    <section className="py-7 sm:py-9 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-semibold text-[#FECF59] mb-2 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#E50000]" />
              <span>Dòng Thời Gian Điện Ảnh</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-white tracking-tight">
              Phim Theo Năm Phát Hành
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 max-w-xl">
              Dễ dàng tìm kiếm và thưởng thức các siêu phẩm điện ảnh yêu thích qua từng mốc thời gian.
            </p>
          </div>

          <Link
            href="/movies"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#9CA3AF] hover:text-[#FECF59] transition-colors group cursor-pointer shrink-0"
          >
            <span>Tất cả phim</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Featured Year Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {FEATURED_YEARS.map((item) => {
            const TagIcon = item.tagIcon;
            const WatermarkIcon = item.watermarkIcon;

            return (
              <Link
                key={String(item.year)}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl p-4 sm:p-4.5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] bg-[#0F0F0F]"
                style={{
                  borderColor: item.borderColor,
                }}
              >
                {/* Background Image & Ambient Gradient Overlay */}
                {item.bgImage ? (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <Image
                      src={item.bgImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover opacity-35 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-80"
                      style={{
                        background: item.gradient,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: item.gradient }}
                  />
                )}

                {/* Background Watermark Icon */}
                <div className="absolute -bottom-2 -right-2 z-[1] opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-300 pointer-events-none">
                  <WatermarkIcon className="w-24 h-24 stroke-[1.2]" />
                </div>

                {/* Ambient Glow Orb */}
                <div
                  className="absolute -top-10 -left-10 z-[1] w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none"
                  style={{ background: item.glowColor }}
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.tagColorClass}`}
                  >
                    <TagIcon className="w-2.5 h-2.5" />
                    <span>{item.tag}</span>
                  </span>

                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 mt-4">
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#FECF59] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#D1D5DB]/80 mt-1 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Year Pill Filter Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#222222]/70 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider shrink-0 mr-1">
            Chọn nhanh năm:
          </span>
          {QUICK_YEARS.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                q.hot
                  ? "bg-[#E50000] text-white shadow-md shadow-[#E50000]/25 border border-[#FF3333] hover:bg-[#FF1A1A]"
                  : "bg-[#161616] hover:bg-[#222222] border border-[#2A2A2A] text-[#D1D5DB] hover:text-white hover:border-[#444]"
              }`}
            >
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
