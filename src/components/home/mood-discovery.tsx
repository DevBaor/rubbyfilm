"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Clapperboard,
  Swords,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface CurationCard {
  id: string;
  tag: string;
  tagIcon: LucideIcon;
  watermarkIcon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  glowColor: string;
  tagColorClass: string;
}

const CURATION_CARDS: CurationCard[] = [
  {
    id: "k-drama",
    tag: "TOP THỊNH HÀNH",
    tagIcon: Heart,
    watermarkIcon: Heart,
    title: "K-Drama Hàn Quốc",
    subtitle: "Kịch tính & lôi cuốn",
    href: "/country/han-quoc",
    gradient: "linear-gradient(135deg, rgba(159, 18, 57, 0.4) 0%, rgba(20, 10, 16, 0.96) 80%)",
    borderColor: "rgba(225, 29, 72, 0.2)",
    hoverBorder: "rgba(225, 29, 72, 0.55)",
    glowColor: "rgba(225, 29, 72, 0.22)",
    tagColorClass: "text-rose-300 bg-rose-500/15 border-rose-500/25",
  },
  {
    id: "bom-tan-au-my",
    tag: "HOLLYWOOD",
    tagIcon: Clapperboard,
    watermarkIcon: Clapperboard,
    title: "Bom Tấn Âu Mỹ",
    subtitle: "Hành động đỉnh cao",
    href: "/country/au-my",
    gradient: "linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(10, 16, 26, 0.96) 80%)",
    borderColor: "rgba(59, 130, 246, 0.2)",
    hoverBorder: "rgba(59, 130, 246, 0.55)",
    glowColor: "rgba(37, 99, 235, 0.22)",
    tagColorClass: "text-blue-300 bg-blue-500/15 border-blue-500/25",
  },
  {
    id: "co-trang-trung-quoc",
    tag: "KIẾM HIỆP",
    tagIcon: Swords,
    watermarkIcon: Swords,
    title: "Cổ Trang Trung Quốc",
    subtitle: "Hùng tráng & mãn nhãn",
    href: "/country/trung-quoc",
    gradient: "linear-gradient(135deg, rgba(180, 83, 9, 0.4) 0%, rgba(24, 14, 8, 0.96) 80%)",
    borderColor: "rgba(245, 158, 11, 0.2)",
    hoverBorder: "rgba(245, 158, 11, 0.55)",
    glowColor: "rgba(217, 119, 6, 0.22)",
    tagColorClass: "text-amber-300 bg-amber-500/15 border-amber-500/25",
  },
  {
    id: "thanh-xuan-vuon-truong",
    tag: "HỌC ĐƯỜNG",
    tagIcon: GraduationCap,
    watermarkIcon: GraduationCap,
    title: "Thanh Xuân Vườn Trường",
    subtitle: "Tình đầu trong sáng",
    href: "/genre/hoc-duong",
    gradient: "linear-gradient(135deg, rgba(190, 24, 93, 0.38) 0%, rgba(24, 10, 18, 0.96) 80%)",
    borderColor: "rgba(244, 63, 94, 0.2)",
    hoverBorder: "rgba(244, 63, 94, 0.55)",
    glowColor: "rgba(244, 63, 94, 0.22)",
    tagColorClass: "text-pink-300 bg-pink-500/15 border-pink-500/25",
  },
  {
    id: "anime-nhat-ban",
    tag: "NHẬT BẢN",
    tagIcon: Sparkles,
    watermarkIcon: Sparkles,
    title: "Anime Hot Nhật Bản",
    subtitle: "Vietsub cập nhật nhanh",
    href: "/genre/hoat-hinh",
    gradient: "linear-gradient(135deg, rgba(5, 122, 85, 0.4) 0%, rgba(8, 22, 16, 0.96) 80%)",
    borderColor: "rgba(16, 185, 129, 0.2)",
    hoverBorder: "rgba(16, 185, 129, 0.55)",
    glowColor: "rgba(16, 185, 129, 0.22)",
    tagColorClass: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25",
  },
];

export function MoodDiscovery() {
  return (
    <section className="py-4 sm:py-6 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#F9FAFB] tracking-tight">
            Khám Phá Theo Chủ Đề
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5 max-w-xl">
            Tuyển tập phim đặc sắc được chọn lọc theo từng thể loại yêu thích
          </p>
        </div>

        {/* 5 Compact Cinema Dark Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-3.5">
          {CURATION_CARDS.map((card) => {
            const TagIcon = card.tagIcon;
            const WatermarkIcon = card.watermarkIcon;

            return (
              <Link
                key={card.id}
                href={card.href}
                className="group relative h-[112px] sm:h-[118px] lg:h-[122px] overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.985]"
                style={{
                  background: card.gradient,
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.hoverBorder;
                  e.currentTarget.style.boxShadow = `0 10px 24px -4px ${card.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = card.borderColor;
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.4)";
                }}
              >
                {/* Subtle Thematic Watermark Icon */}
                <div className="absolute -right-2 -bottom-2 pointer-events-none text-white/[0.04] group-hover:text-white/[0.09] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
                  <WatermarkIcon className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.2]" />
                </div>

                {/* Subtle Shimmer Sweeping Highlight on Hover */}
                <div className="absolute inset-0 -translate-x-[130%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                {/* Top: Compact Frosted Tag Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md transition-colors ${card.tagColorClass}`}
                  >
                    <TagIcon className="w-2.5 h-2.5" />
                    <span>{card.tag}</span>
                  </span>
                </div>

                {/* Bottom: Title, Subtitle & Action */}
                <div className="relative z-10 flex flex-col gap-0.5 mt-auto">
                  <h3 className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-bold text-[#F9FAFB] leading-snug tracking-tight truncate group-hover:text-white transition-colors">
                    {card.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-0.5">
                    <span className="truncate pr-1 group-hover:text-[#D1D5DB] transition-colors">
                      {card.subtitle}
                    </span>
                    <span className="inline-flex items-center text-[10.5px] font-medium text-white/60 group-hover:text-white transition-colors shrink-0">
                      <span>Xem</span>
                      <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
