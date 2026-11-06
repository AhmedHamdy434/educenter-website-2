import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionHeroBannerSkeleton() {
  return (
    <>
      {/* Top Banner Row Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-xl shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-44 rounded-md" />
              <Skeleton className="h-5.5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-60 rounded mt-0.5" />
          </div>
        </div>
        <Skeleton className="h-8 w-44 rounded-md" />
      </div>

      {/* Quotas Progress Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-2 bg-secondary/30 p-3.5 rounded-xl border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-3.5 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <div className="space-y-2 bg-secondary/30 p-3.5 rounded-xl border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-3.5 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    </>
  );
}

export function FinancialMetricsSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="h-3 w-56 rounded" />
    </div>
  );
}

export function RecentActivityFeedSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2"
      aria-busy="true"
    >
      {/* Payments Skeleton Card */}
      <Card className="p-5 border-border bg-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4.5 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-2.5 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Settlements Skeleton Card */}
      <Card className="p-5 border-border bg-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4.5 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
