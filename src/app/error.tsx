"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        Đã Xảy Ra Sự Cố Bất Ngờ
      </h2>
      <p className="text-sm text-cinema-400 max-w-md mb-8 leading-relaxed">
        Hệ thống không thể tải dữ liệu cho trang này. Vui lòng thử tải lại hoặc quay về trang chủ.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Thử Tải Lại</span>
        </Button>
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Trang Chủ</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
