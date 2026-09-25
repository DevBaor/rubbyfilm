import Link from "next/link";
import { Film, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="w-20 h-20 rounded-3xl bg-cinema-800 border border-cinema-700 flex items-center justify-center text-brand mb-6 shadow-xl">
        <Film className="w-10 h-10" />
      </div>
      <span className="text-sm font-bold tracking-widest text-brand uppercase mb-2">
        404 ERROR
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Không Tìm Thấy Trang Hoặc Bộ Phim
      </h1>
      <p className="text-sm text-cinema-400 max-w-md mb-8 leading-relaxed">
        Nội dung bạn đang tìm kiếm có thể đã được thay đổi địa chỉ hoặc tạm thời không khả dụng trên hệ thống.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary" className="gap-2 font-semibold">
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="secondary" className="gap-2">
            <Search className="w-4 h-4" />
            <span>Tìm Kiếm Phim Khác</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
