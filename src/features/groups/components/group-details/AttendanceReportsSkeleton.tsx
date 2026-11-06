import { Skeleton } from "@/components/ui/skeleton";

export function StudentListCardSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Skeleton className="size-8 rounded-lg shrink-0" />
        <Skeleton className="h-4 w-36 rounded" />
      </div>

      <div className="max-h-72 divide-y divide-border/60 overflow-y-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0 space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
}
