import { movieProvider } from "@/lib/providers";
import { MovieHero } from "@/components/movie/movie-hero";
import { MoodDiscovery } from "@/components/home/mood-discovery";
import { MovieRow } from "@/components/movie/movie-row";
import { ContinueWatchingRow } from "@/components/movie/continue-watching-row";
import { TrendingSection } from "@/components/home/trending-section";
import { EditorialSpotlight } from "@/components/home/editorial-spotlight";
import { YearDiscovery } from "@/components/home/year-discovery";
import { DevicesSection } from "@/components/home/devices-section";
import { FaqSection } from "@/components/home/faq-section";
import { StreamCta } from "@/components/home/stream-cta";
import { AuthSyncBanner } from "@/components/home/auth-sync-banner";
import { getTmdbBackdropUrl, getTmdbLogoUrl } from "@/lib/server/tmdb";
import { Movie } from "@/types/movie";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RubbyFilm - Trải Nghiệm Điện Ảnh Đỉnh Cao Chuẩn 4K HDR",
  description:
    "Khám phá hàng ngàn tựa phim điện ảnh bom tấn chiếu rạp, phim bộ đặc sắc, anime tuyển chọn với chất lượng 4K HDR sống động trên RubbyFilm hoàn toàn miễn phí.",
  openGraph: {
    title: "RubbyFilm - Nền Tảng Xem Phim Trực Tuyến Đỉnh Cao",
    description:
      "Thế giới điện ảnh bom tấn và series truyền hình chất lượng 4K HDR không giới hạn.",
    type: "website",
    locale: "vi_VN",
    siteName: "RubbyFilm",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch curated home sections
  const homeData = await movieProvider.getHomeMovies();

  // 1. Hero Carousel (Chỉ tuyển chọn các siêu phẩm HOT mới nhất năm 2026)
  const allCandidates = [
    ...(homeData.featured || []),
    ...(homeData.hot || []),
    ...(homeData.latest || []),
    ...(homeData.singles || []),
    ...(homeData.series || []),
  ];

  const uniqueCandidates = Array.from(
    new Map(allCandidates.map((m) => [m.id, m])).values()
  );

  const heroPool2026 = uniqueCandidates.filter(
    (m) =>
      m.year === 2026 &&
      Boolean(m.backdropUrl) &&
      !m.backdropUrl.endsWith("-poster.webp") &&
      !m.backdropUrl.endsWith("poster.webp") &&
      m.backdropUrl.length > 10
  );

  const heroPool = heroPool2026.length >= 6
    ? heroPool2026
    : [
        ...heroPool2026,
        ...uniqueCandidates.filter(
          (m) =>
            m.year !== 2026 &&
            Boolean(m.backdropUrl) &&
            !m.backdropUrl.endsWith("-poster.webp") &&
            !m.backdropUrl.endsWith("poster.webp") &&
            m.backdropUrl.length > 10 &&
            (m.year ? m.year >= 2025 : true)
        ),
      ];

  // Smart Dynamic Shuffle on each visit / refresh:
  // - Top #1 blockbuster is anchored to guarantee an immediate WOW impression
  // - The remaining 5 movies are randomly picked from the top hot 2026 pool (never duplicated)
  // - Every F5 provides a fresh mix of 6 newly released, ultra-hot 2026 blockbusters!
  const heroMovies = (() => {
    if (heroPool.length <= 6) return heroPool;
    const anchor = heroPool[0];
    const candidates = heroPool.slice(1);
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return [anchor, ...shuffled.slice(0, 5)];
  })();
  const heroIds = new Set(heroMovies.map((m) => m.id));

  // 2. Trending Now (10 hot movies)
  const trendingMovies = (homeData.hot || []).slice(0, 10);

  // 3. Phim Mới Cập Nhật (14+ distinct new updates)
  const latestMovies = (homeData.latest || []).slice(0, 16);

  // 4. Standout Editorial Spotlight: 5-6 curated high-res cinematic spotlight movies
  const candidateSpotlights = [
    ...(homeData.recommended || []),
    ...(homeData.singles || []),
    ...(homeData.hot || []),
    ...(homeData.series || []),
  ];

  const seenSpotlightIds = new Set<string>();
  const spotlightMovies: Movie[] = [];

  for (const m of candidateSpotlights) {
    if (heroIds.has(m.id)) continue;
    if (seenSpotlightIds.has(m.id)) continue;
    if (
      Boolean(m.backdropUrl) &&
      !m.backdropUrl.endsWith("-poster.webp") &&
      !m.backdropUrl.endsWith("poster.webp") &&
      m.backdropUrl.length > 10
    ) {
      seenSpotlightIds.add(m.id);
      spotlightMovies.push(m);
      if (spotlightMovies.length >= 6) break;
    }
  }

  if (spotlightMovies.length === 0 && homeData.featured?.[0]) {
    spotlightMovies.push(homeData.featured[0]);
  }

  // Auto-upgrade to TMDB 4K / Original backdrops and logos
  const hasTmdb = Boolean(process.env.TMDB_API_KEY || true);
  if (hasTmdb) {
    await Promise.all([
      ...heroMovies.map(async (m) => {
        if (m.tmdbId) {
          const type = m.type === "series" ? "tv" : "movie";
          const [tmdbBackdrop, tmdbLogo] = await Promise.all([
            getTmdbBackdropUrl(m.tmdbId, type),
            getTmdbLogoUrl(m.tmdbId, type),
          ]);
          if (tmdbBackdrop) {
            m.backdropUrl = tmdbBackdrop;
          }
          if (tmdbLogo) {
            m.logoUrl = tmdbLogo;
          }
        }
      }),
      ...spotlightMovies.map(async (m) => {
        if (m.tmdbId) {
          const type = m.type === "series" ? "tv" : "movie";
          const tmdbBackdrop = await getTmdbBackdropUrl(m.tmdbId, type);
          if (tmdbBackdrop) {
            m.backdropUrl = tmdbBackdrop;
          }
        }
      }),
    ]);
  }

  // 5. Phim Lẻ Chiếu Rạp (14-16 contemporary cinema blockbusters)
  const singleMovies = (homeData.singles || []).slice(0, 16);

  // 6. Phim Bộ Đặc Sắc (14-16 top series)
  const seriesMovies = (homeData.series || []).slice(0, 16);

  // 7. Anime & Hoạt Hình Tuyển Chọn (14-16 anime favorites)
  const animeMovies = (homeData.animation || []).slice(0, 16);

  // 8. Phim Hành Động Kịch Tính (14-16 genuine live-action blockbusters)
  const actionMovies = (homeData.action || []).slice(0, 16);

  return (
    <main className="flex flex-col w-full pb-16 overflow-x-hidden min-h-screen bg-[#0F0F0F] relative">
      {/* Ambient Theatrical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#E50000]/12 via-[#E50000]/4 to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-[#E50000]/5 blur-[160px] pointer-events-none -z-0" />
      <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-[#E50000]/5 blur-[160px] pointer-events-none -z-0" />

      {/* 1. Large Cinematic Hero Carousel */}
      <MovieHero movies={heroMovies} />

      {/* 2. Mood & Emotion Discovery */}
      <MoodDiscovery />

      {/* Auth Sync & Continuation CTA Banner */}
      <AuthSyncBanner />

      {/* 3. Continue Watching (Rendered only when user has watch history) */}
      <ContinueWatchingRow />

      {/* 4. Trending Now with Top 10 Ranking */}
      {trendingMovies.length > 0 && <TrendingSection movies={trendingMovies} />}

      {/* 5. Phim Mới Cập Nhật */}
      {latestMovies.length > 0 && (
        <MovieRow
          id="latest"
          title="Phim Mới Cập Nhật"
          subtitle="Những tác phẩm vừa được cập nhật bản đẹp và thuyết minh mới nhất"
          movies={latestMovies}
          viewAllHref="/movies?sort=latest"
        />
      )}

      {/* 6. Phân Loại Phim Theo Năm Phát Hành (Year Discovery) */}
      <YearDiscovery />

      {/* 7. Editorial Spotlight: Panoramic artwork showcase (Auto-play Carousel) */}
      {spotlightMovies.length > 0 && <EditorialSpotlight movies={spotlightMovies} />}

      {/* 8. Phim Lẻ Chiếu Rạp */}
      {singleMovies.length > 0 && (
        <MovieRow
          title="Phim Lẻ Chiếu Rạp"
          subtitle="Trải nghiệm chất lượng rạp chiếu ngay tại gia đình bạn"
          movies={singleMovies}
          viewAllHref="/movies?type=single"
        />
      )}

      {/* 9. Phim Bộ Đặc Sắc */}
      {seriesMovies.length > 0 && (
        <MovieRow
          title="Phim Bộ Đặc Sắc"
          subtitle="Trọn bộ các series truyền hình đình đám và lôi cuốn nhất"
          movies={seriesMovies}
          viewAllHref="/movies?type=series"
        />
      )}

      {/* 10. Hoạt Hình & Anime */}
      {animeMovies.length > 0 && (
        <MovieRow
          title="Hoạt Hình & Anime Tuyển Chọn"
          subtitle="Thế giới hình họa sống động và giàu cảm xúc cho mọi lứa tuổi"
          movies={animeMovies}
          viewAllHref="/genre/hoat-hinh"
        />
      )}

      {/* 11. Phim Hành Động Kịch Tính */}
      {actionMovies.length > 0 && (
        <MovieRow
          title="Phim Hành Động Kịch Tính"
          subtitle="Những pha rượt đuổi nghẹt thở và chiến đấu đỉnh cao"
          movies={actionMovies}
          viewAllHref="/genre/hanh-dong"
        />
      )}

      {/* 12. Multi-Device Experience */}
      <DevicesSection />

      {/* 13. Frequently Asked Questions (FAQ) */}
      <FaqSection />

      {/* 14. Free Streaming CTA Banner with Real Trending Movie Stack */}
      <StreamCta movies={trendingMovies} />
    </main>
  );
}
