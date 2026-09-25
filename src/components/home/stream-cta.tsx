"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Zap, ShieldCheck, Film, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";

interface StreamCtaProps {
  movies?: Movie[];
}

// Curated real blockbuster movie poster fallbacks if API data is not passed
const REAL_FALLBACK_MOVIES = [
  {
    title: "Deadpool & Wolverine",
    slug: "deadpool-va-wolverine",
    posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    rating: 8.9,
    badge: "Bom Tấn 2024",
  },
  {
    title: "Dune: Hành Tinh Cát 2",
    slug: "dune-hanh-tinh-cat-phan-hai",
    posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 8.8,
    badge: "4K Chiếu Rạp",
  },
  {
    title: "Spider-Man: Không Còn Nhà",
    slug: "nguoi-nhen-khong-con-nha",
    posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    rating: 9.1,
    badge: "VIP 4K",
  },
];

export function StreamCta({ movies }: StreamCtaProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  // Normalize movies list from props or fallback blockbusters
  const moviePool = React.useMemo(() => {
    if (movies && movies.length >= 3) {
      return movies.map((m, idx) => ({
        title: m.title,
        slug: m.slug,
        posterUrl: m.posterUrl || REAL_FALLBACK_MOVIES[idx % REAL_FALLBACK_MOVIES.length].posterUrl,
        rating: m.rating || 8.8,
        badge: idx % 3 === 0 ? "Phim Rạp Hot" : idx % 3 === 1 ? "4K UHD" : "VIP 4K",
      }));
    }
    return REAL_FALLBACK_MOVIES;
  }, [movies]);

  // Auto-rotate every 4 seconds when user is not hovering
  React.useEffect(() => {
    if (moviePool.length <= 3 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moviePool.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [moviePool.length, isHovered]);

  const total = moviePool.length;
  const leftMovie = moviePool[currentIndex % total];
  const rightMovie = moviePool[(currentIndex + 1) % total];
  const centerMovie = moviePool[(currentIndex + 2) % total];

  return (
    <section className="py-12 sm:py-20 select-none overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-[#262626] hover:border-[#E50000]/40 transition-colors duration-500 bg-gradient-to-br from-[#161616] via-[#0D0D0D] to-[#121212] overflow-hidden p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          
          {/* Ambient Lighting & Glow Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E50000]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-[#E50000]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

          {/* Decorative Film Grid Lines in Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content (7 cols on lg) */}
            <div className="lg:col-span-7 xl:col-span-7 text-center md:text-left">
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50000]/15 border border-[#E50000]/30 text-[#E50000] text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
                <span>Trải Nghiệm Điện Ảnh Chuẩn 4K HDR • Miễn Phí 100%</span>
              </div>

              {/* Bold Title */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F9FAFB] tracking-[-0.02em] leading-[1.15] mb-4 drop-shadow-md">
                Bắt Đầu Trải Nghiệm Xem Phim <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9FAFB] via-[#F3F4F6] to-[#D1D5DB]">Ngay Hôm Nay!</span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#D1D5DB] font-normal leading-[1.6] max-w-2xl mb-8">
                Khám phá hàng ngàn tựa phim điện ảnh bom tấn chiếu rạp, series truyền hình lôi cuốn và anime đỉnh cao. Thưởng thức mượt mà tốc độ cao với máy chủ CDN độc quyền, hoàn toàn không cần đăng ký hay tốn phí.
              </p>

              {/* Feature Highlights Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-[#E50000]/20 flex items-center justify-center text-[#E50000] flex-shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-[#F9FAFB]">Tốc Độ Siêu Tốc</div>
                    <div className="text-[11px] text-[#9CA3AF]">Băng Thông Cao</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-[#F9FAFB]">Chuẩn 4K & FHD</div>
                    <div className="text-[11px] text-[#9CA3AF]">Âm Thanh Sống Động</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-[#F9FAFB]">Không Phí Ẩn</div>
                    <div className="text-[11px] text-[#9CA3AF]">Xem Ngay Tức Thì</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href="/movies">
                  <Button
                    size="lg"
                    className="relative group px-8 py-6 rounded-2xl font-black gap-2.5 text-white bg-[#E50000] hover:bg-[#FF1A1A] shadow-[0_10px_30px_rgba(229,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(229,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base border border-white/20"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5 group-hover:scale-110 transition-transform" />
                    <span>Khám Phá Kho Phim</span>
                  </Button>
                </Link>

                <Link href="/trending">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-7 py-6 rounded-2xl font-bold gap-2 text-cinema-200 hover:text-white bg-[#1A1A1A]/80 hover:bg-[#252525] border border-[#2E2E2E] hover:border-white/30 transition-all text-sm sm:text-base backdrop-blur-sm"
                  >
                    <span>Phim Thịnh Hành</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual Element: Vertically & Horizontally Centered 3D Fan-Out Real Movie Stack (5 cols on lg) */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center mt-6 lg:mt-0">
              <div 
                className="relative w-full max-w-[380px] sm:max-w-[420px] h-[340px] sm:h-[380px] select-none group/stack flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >

                {/* Poster 1 (Left Card - Fans Out to the Left on Hover) */}
                <Link
                  href={`/movie/${leftMovie.slug}`}
                  className="absolute left-1/2 top-1/2 -translate-x-[68%] -translate-y-[46%] w-[165px] sm:w-[190px] h-[245px] sm:h-[285px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out bg-[#141414] cursor-pointer
                    -rotate-6 opacity-90 z-0
                    group-hover/stack:-translate-x-[115%] group-hover/stack:-translate-y-[52%] group-hover/stack:-rotate-[18deg] group-hover/stack:opacity-100 group-hover/stack:shadow-[0_25px_50px_rgba(0,0,0,0.9)] group-hover/stack:border-white/30
                    hover:!scale-110 hover:!z-30 hover:!border-[#E50000] hover:!shadow-[0_30px_60px_rgba(229,0,0,0.5)]"
                  title={leftMovie.title}
                >
                  <Image
                    key={leftMovie.slug}
                    src={leftMovie.posterUrl}
                    alt={leftMovie.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 hover:scale-105 animate-fade-in"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-400 border border-white/10 flex items-center gap-0.5 pointer-events-none">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{leftMovie.rating}</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                    <div className="text-[11px] font-bold text-white truncate drop-shadow">{leftMovie.title}</div>
                    <div className="text-[9px] text-[#FECF59] font-medium">{leftMovie.badge}</div>
                  </div>
                </Link>

                {/* Poster 2 (Right Card - Fans Out to the Right on Hover) */}
                <Link
                  href={`/movie/${rightMovie.slug}`}
                  className="absolute left-1/2 top-1/2 -translate-x-[32%] -translate-y-[46%] w-[165px] sm:w-[190px] h-[245px] sm:h-[285px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out bg-[#141414] cursor-pointer
                    rotate-6 opacity-90 z-0
                    group-hover/stack:translate-x-[15%] group-hover/stack:-translate-y-[52%] group-hover/stack:rotate-[18deg] group-hover/stack:opacity-100 group-hover/stack:shadow-[0_25px_50px_rgba(0,0,0,0.9)] group-hover/stack:border-white/30
                    hover:!scale-110 hover:!z-30 hover:!border-[#E50000] hover:!shadow-[0_30px_60px_rgba(229,0,0,0.5)]"
                  title={rightMovie.title}
                >
                  <Image
                    key={rightMovie.slug}
                    src={rightMovie.posterUrl}
                    alt={rightMovie.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 hover:scale-105 animate-fade-in"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-white border border-white/10 pointer-events-none">
                    4K UHD
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                    <div className="text-[11px] font-bold text-white truncate drop-shadow">{rightMovie.title}</div>
                    <div className="text-[9px] text-cinema-400 font-medium">{rightMovie.badge}</div>
                  </div>
                </Link>

                {/* Poster 3 (Center Card - Real Movie, Lifts & Glows on Hover) */}
                <Link
                  href={`/movie/${centerMovie.slug}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[185px] sm:w-[215px] h-[275px] sm:h-[320px] rounded-2xl overflow-hidden border-2 border-[#E50000]/70 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-10 bg-[#1A1A1A] transition-all duration-500 ease-out cursor-pointer
                    group-hover/stack:-translate-y-[58%] group-hover/stack:scale-105 group-hover/stack:border-[#E50000] group-hover/stack:shadow-[0_30px_70px_rgba(229,0,0,0.55)]
                    hover:!scale-110 hover:!z-30 hover:!shadow-[0_35px_80px_rgba(229,0,0,0.85)]"
                  title={centerMovie.title}
                >
                  <Image
                    key={centerMovie.slug}
                    src={centerMovie.posterUrl}
                    alt={centerMovie.title}
                    fill
                    unoptimized
                    className="object-cover group-hover/stack:scale-105 transition-transform duration-500 animate-fade-in"
                    sizes="220px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                  {/* Floating VIP badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#E50000] text-white text-[10px] font-black uppercase tracking-wider shadow-lg pointer-events-none">
                    {centerMovie.badge}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                    <div className="text-xs font-black text-white truncate drop-shadow-md">{centerMovie.title}</div>
                    <div className="text-[10px] text-[#FECF59] font-bold flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-[#FECF59]" />
                      <span>{centerMovie.rating} • Rubby VIP</span>
                    </div>
                  </div>
                </Link>

              </div>

              {/* Subtle Auto-Rotation Carousel Dots Indicator */}
              {total > 3 && (
                <div className="flex items-center gap-1.5 mt-4 z-20">
                  {Array.from({ length: Math.min(total, 6) }).map((_, dotIdx) => {
                    const isActive = (currentIndex % Math.min(total, 6)) === dotIdx;
                    return (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentIndex(dotIdx)}
                        className={`transition-all duration-300 rounded-full ${
                          isActive
                            ? "w-6 h-1.5 bg-[#E50000] shadow-[0_0_8px_rgba(229,0,0,0.8)]"
                            : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                        }`}
                        aria-label={`Chuyển tới phim ${dotIdx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
