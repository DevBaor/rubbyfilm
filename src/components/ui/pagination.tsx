"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageUrlPattern?: string; // e.g. "/movies?page=[PAGE]&genre=action"
  getPageUrl?: (page: number) => string;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageUrlPattern,
  getPageUrl,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const resolveUrl = (page: number): string | null => {
    if (pageUrlPattern) {
      return pageUrlPattern
        .replace(/%5BPAGE%5D/gi, page.toString())
        .replace(/\[PAGE\]/gi, page.toString());
    }
    if (getPageUrl) {
      return getPageUrl(page);
    }
    return null;
  };

  const isLinkMode = Boolean(pageUrlPattern || getPageUrl);

  // Generate page numbers with ellipsis
  const getVisiblePages = () => {
    const delta = 2; // show 2 pages around current on desktop
    const range: (number | "ellipsis")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "ellipsis") {
        range.push("ellipsis");
      }
    }

    return range;
  };

  const pages = getVisiblePages();

  const renderPageItem = (p: number | "ellipsis", index: number) => {
    if (p === "ellipsis") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="w-7 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#666666]"
        >
          <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
      );
    }

    const isCurrent = p === currentPage;
    const isAdjacentOnMobile = Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages;
    const url = resolveUrl(p);

    const buttonClass = cn(
      "h-8 sm:h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-200 border",
      isCurrent
        ? "w-8 sm:w-9 bg-[#E50000] text-white border-[#E50000] shadow-md shadow-[#E50000]/30 font-bold scale-105 z-10"
        : "w-8 sm:w-9 bg-[#1A1A1A] text-[#CCCCCC] border-[#262626] hover:bg-[#262626] hover:text-white hover:border-[#404040]",
      // On narrow mobile devices, hide page numbers that are 2 steps away to prevent overflow
      !isAdjacentOnMobile && "hidden sm:flex"
    );

    if (isLinkMode && url) {
      return (
        <Link
          key={p}
          href={url}
          className={buttonClass}
          aria-current={isCurrent ? "page" : undefined}
        >
          {p}
        </Link>
      );
    }

    return (
      <button
        key={p}
        type="button"
        onClick={() => onPageChange?.(p)}
        className={buttonClass}
        aria-current={isCurrent ? "page" : undefined}
      >
        {p}
      </button>
    );
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const prevUrl = hasPrev ? resolveUrl(prevPage) : null;
  const nextUrl = hasNext ? resolveUrl(nextPage) : null;

  return (
    <nav
      role="navigation"
      aria-label="Điều hướng phân trang"
      className={cn("flex items-center justify-center gap-1 sm:gap-2 my-8 select-none flex-wrap", className)}
    >
      {/* Previous Button */}
      {isLinkMode && prevUrl ? (
        <Link
          href={prevUrl}
          className="w-8 h-8 sm:w-auto sm:h-9 px-0 sm:px-3 rounded-xl flex items-center justify-center gap-1 text-xs font-medium border border-[#262626] bg-[#1A1A1A] text-[#CCCCCC] hover:bg-[#262626] hover:text-white hover:border-[#404040] transition-colors"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange?.(prevPage)}
          disabled={!hasPrev}
          className={cn(
            "w-8 h-8 sm:w-auto sm:h-9 px-0 sm:px-3 rounded-xl flex items-center justify-center gap-1 text-xs font-medium border transition-colors",
            hasPrev
              ? "bg-[#1A1A1A] text-[#CCCCCC] border-[#262626] hover:bg-[#262626] hover:text-white hover:border-[#404040]"
              : "bg-[#121212] text-[#444444] border-[#1C1C1C] cursor-not-allowed opacity-40"
          )}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>
      )}

      {/* Visible Pages */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p, idx) => renderPageItem(p, idx))}
      </div>

      {/* Next Button */}
      {isLinkMode && nextUrl ? (
        <Link
          href={nextUrl}
          className="w-8 h-8 sm:w-auto sm:h-9 px-0 sm:px-3 rounded-xl flex items-center justify-center gap-1 text-xs font-medium border border-[#262626] bg-[#1A1A1A] text-[#CCCCCC] hover:bg-[#262626] hover:text-white hover:border-[#404040] transition-colors"
          aria-label="Trang tiếp"
        >
          <span className="hidden sm:inline">Tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange?.(nextPage)}
          disabled={!hasNext}
          className={cn(
            "w-8 h-8 sm:w-auto sm:h-9 px-0 sm:px-3 rounded-xl flex items-center justify-center gap-1 text-xs font-medium border transition-colors",
            hasNext
              ? "bg-[#1A1A1A] text-[#CCCCCC] border-[#262626] hover:bg-[#262626] hover:text-white hover:border-[#404040]"
              : "bg-[#121212] text-[#444444] border-[#1C1C1C] cursor-not-allowed opacity-40"
          )}
          aria-label="Trang tiếp"
        >
          <span className="hidden sm:inline">Tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
}
