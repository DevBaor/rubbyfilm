"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export function AuthShell({ children, title, subtitle, badge }: AuthShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-x-hidden bg-[#0A0A0A] pt-24 sm:pt-28 pb-12 sm:pb-16 px-4">
      {/* Background Poster Wall with Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/auth-backdrop.jpg"
          alt="Cinema Movie Wall"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 scale-105 filter blur-[1.5px]"
        />
        {/* Layered Vignette Overlays for Maximum Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.5)_0%,rgba(10,10,10,0.85)_70%,rgba(10,10,10,0.98)_100%)]" />
      </div>

      {/* Atmospheric Ambient Lighting Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-[#E50000]/12 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Centered Auth Card Container */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto">
        {/* Floating Glassmorphic Cinema Card */}
        <div className="relative bg-[#121212]/95 backdrop-blur-2xl border border-white/[0.09] hover:border-white/[0.15] transition-colors duration-300 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
          {/* Subtle Top Crimson Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50000] to-transparent opacity-90" />

          {/* Integrated Modern Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#1A1A1A] rounded-2xl mb-6 border border-white/[0.06]">
            <Link
              href="/login"
              className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isLoginPage
                  ? "bg-[#E50000] text-white shadow-md shadow-[#E50000]/30"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.04]"
              }`}
            >
              Đăng Nhập
            </Link>
            <Link
              href="/register"
              className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                isRegisterPage
                  ? "bg-[#E50000] text-white shadow-md shadow-[#E50000]/30"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.04]"
              }`}
            >
              Đăng Ký
            </Link>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-[#F9FAFB] tracking-[-0.02em]">
              {title}
            </h1>
            <p className="text-xs text-[#9CA3AF] font-normal mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Security Footnote */}
        <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>Bảo mật SSL 256-bit</span>
          </span>
          <span className="text-[#333333]">•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#FECF59]/80" />
            <span>Mã hóa tài khoản an toàn</span>
          </span>
        </div>
      </div>
    </div>
  );
}
