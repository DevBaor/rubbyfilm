"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, History, Heart, Monitor, ListPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AuthSyncBannerProps {
  className?: string;
}

export function AuthSyncBanner({ className }: AuthSyncBannerProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Hide banner completely once user is logged in
  if (isAuthenticated) {
    return null;
  }

  return (
    <section className={cn("py-5 sm:py-7 select-none relative z-10", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#282828] hover:border-[#E50000]/40 transition-colors duration-500 bg-gradient-to-r from-[#181818] via-[#141414] to-[#111111] overflow-hidden shadow-2xl p-6 sm:p-8 lg:p-9">
          
          {/* Subtle Ambient Glow Orbs aligned with RubbyFilm theme */}
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-[#E50000]/12 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-[#FECF59]/8 rounded-full blur-[110px] pointer-events-none" />

          {/* Film grid texture overlay */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

          {/* 3-Column Responsive Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Column: Heading, Subtitle & Action Button (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <h2 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-[#F9FAFB] tracking-[-0.02em] leading-snug">
                {isAuthenticated ? (
                  <>Xin chào, <span className="text-[#FECF59]">{user?.name || "Bạn"}</span>!</>
                ) : (
                  <>Đăng nhập để <span className="text-[#FECF59]">lưu phim xem tiếp</span></>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-[#D1D5DB] font-normal leading-[1.6] max-w-sm mt-2 mb-6">
                {isAuthenticated
                  ? "Tài khoản của bạn đã được đồng bộ danh sách phim yêu thích và tiến trình xem dở trên mọi thiết bị."
                  : "Lưu phim đang xem, đồng bộ trên nhiều thiết bị, tạo danh sách riêng — hoàn toàn miễn phí."}
              </p>

              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E50000] hover:bg-[#FF1A1A] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#E50000]/30 transition-all hover:scale-105 active:scale-95 border border-white/20"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Trang cá nhân</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FECF59] hover:bg-[#FFD875] text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-[#FECF59]/25 transition-all hover:scale-105 active:scale-95 group/btn border border-white/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Middle Column: 2x2 Feature List (4 cols on lg) */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center shrink-0 shadow-sm">
                  <History className="w-4 h-4 text-[#FECF59]" />
                </div>
                <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-medium whitespace-nowrap">
                  Lưu tiến trình xem
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-4 h-4 text-[#E50000]" />
                </div>
                <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-medium whitespace-nowrap">
                  Thêm phim yêu thích
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center shrink-0 shadow-sm">
                  <Monitor className="w-4 h-4 text-[#FECF59]" />
                </div>
                <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-medium whitespace-nowrap">
                  Đồng bộ đa thiết bị
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center shrink-0 shadow-sm">
                  <ListPlus className="w-4 h-4 text-[#E50000]" />
                </div>
                <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-medium whitespace-nowrap">
                  Tạo danh sách riêng
                </span>
              </div>
            </div>

            {/* Right Column: Modern Cinema Stars Artwork with Smooth Gradient Blend (3 cols on lg) */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-end relative h-[195px]">
              <div className="relative w-[230px] h-[215px] overflow-hidden rounded-r-2xl">
                <Image
                  src="/images/auth-banner-actors.jpg"
                  alt="Đồng bộ trải nghiệm xem phim RubbyFilm"
                  fill
                  className="object-cover object-top scale-105"
                  sizes="260px"
                  priority
                />
                {/* Seamless Multi-Directional Gradient Blend into Cinema Dark theme */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
