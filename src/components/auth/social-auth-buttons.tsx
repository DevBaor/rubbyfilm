"use client";

import * as React from "react";

interface SocialAuthButtonsProps {
  callbackUrl?: string;
  disabled?: boolean;
  dividerText?: string;
}

export function SocialAuthButtons({
  callbackUrl = "/",
  disabled = false,
  dividerText = "HOẶC TIẾP TỤC VỚI",
}: SocialAuthButtonsProps) {
  const [connectingProvider, setConnectingProvider] = React.useState<"google" | "facebook" | null>(null);

  const handleOAuthClick = (provider: "google" | "facebook") => {
    if (disabled || connectingProvider) return;
    setConnectingProvider(provider);
    const targetUrl = `/api/auth/oauth/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = targetUrl;
  };

  return (
    <div className="space-y-4">
      {/* Subtle Visual Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-[#121212] px-3 text-[#71717A] font-semibold tracking-wider">
            {dividerText}
          </span>
        </div>
      </div>

      {/* Social Provider Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleOAuthClick("google")}
          disabled={disabled || Boolean(connectingProvider)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/[0.08] hover:border-white/[0.18] text-[#F9FAFB] text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group select-none cursor-pointer"
          aria-label="Tiếp tục với Google"
        >
          {connectingProvider === "google" ? (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              <span className="text-[11px]">Đang kết nối...</span>
            </div>
          ) : (
            <>
              {/* Official Google 4-Color Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </>
          )}
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleOAuthClick("facebook")}
          disabled={disabled || Boolean(connectingProvider)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/[0.08] hover:border-white/[0.18] text-[#F9FAFB] text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group select-none cursor-pointer"
          aria-label="Tiếp tục với Facebook"
        >
          {connectingProvider === "facebook" ? (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1877F2] border-t-transparent animate-spin" />
              <span className="text-[11px]">Đang kết nối...</span>
            </div>
          ) : (
            <>
              {/* Official Facebook Logo */}
              <svg className="w-4 h-4 shrink-0" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
