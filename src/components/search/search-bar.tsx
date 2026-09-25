"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: (val: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  autoFocus = false,
  placeholder = "Tìm kiếm phim, diễn viên, thể loại...",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      if (onSubmit) {
        onSubmit(value.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full rounded-xl bg-cinema-800/90 border border-cinema-700/70 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-200 shadow-inner",
        className
      )}
    >
      <div className="pl-4 text-cinema-400 pointer-events-none flex items-center">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-brand" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-cinema-400 outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Xóa từ khóa tìm kiếm"
          className="pr-3 text-cinema-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
