import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({
  count = 3,
}: LoadingSkeletonProps) {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Content */}
          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </article>
      ))}
    </div>
  );
}