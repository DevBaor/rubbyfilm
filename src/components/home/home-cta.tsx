"use client";

import * as React from "react";
import Link from "next/link";
import { Film, Tv, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

export function HomeCta() {
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cinema-900 via-cinema-900/90 to-cinema-950 border border-white/[0.1] p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-amber-500/15 via-brand/10 to-transparent blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-brand text-xs font-bold backdrop-blur-md mb-6 shadow-sm">
            <span>TRẢI NGHIỆM ĐIỆN ẢNH ĐỈNH CAO</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            Câu Chuyện Yêu Thích Tiếp Theo Đang Chờ Đón Bạn
          </h2>

          {/* Subtext */}
          <p className="text-xs sm:text-base text-cinema-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Hàng ngàn tác phẩm điện ảnh bom tấn, series truyền hình lôi cuốn với hình ảnh 4K sắc nét và âm thanh sống động sẵn sàng phục vụ bạn mọi lúc, mọi nơi.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
            <Link href="/movies">
              <Button
                size="lg"
                className="px-6 sm:px-8 py-3.5 rounded-full font-bold gap-2 text-cinema-950 bg-gradient-to-r from-amber-400 via-brand to-amber-500 hover:from-amber-300 hover:via-brand hover:to-amber-400 shadow-xl shadow-brand/25 transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Film className="w-4 h-4 fill-current" />
                <span>Khám Phá Kho Phim</span>
              </Button>
            </Link>

            <Link href="/series">
              <Button
                variant="secondary"
                size="lg"
                className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold gap-2 backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white shadow-lg transition-all duration-200"
              >
                <Tv className="w-4 h-4" />
                <span>Xem Phim Bộ Mới Nhất</span>
              </Button>
            </Link>

            {mounted && !isAuthenticated && (
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-5 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold gap-2 backdrop-blur-md bg-transparent hover:bg-white/[0.08] border-white/20 text-brand hover:text-white transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Tài Khoản Miễn Phí</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
