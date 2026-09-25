import { MovieRowSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-cinema-900 pb-20">
      {/* Hero Skeleton */}
      <div className="w-full h-[70vh] min-h-[500px] bg-cinema-950 relative overflow-hidden flex flex-col justify-end p-8 sm:p-12">
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-lg" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Row Skeletons */}
      <div className="space-y-4 -mt-8 relative z-10">
        <MovieRowSkeleton title="Đang tải danh sách phim..." />
        <MovieRowSkeleton />
      </div>
    </div>
  );
}
