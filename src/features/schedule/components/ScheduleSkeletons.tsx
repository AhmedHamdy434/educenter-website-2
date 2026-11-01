import { Skeleton } from '@/components/ui/skeleton';

export function ScheduleCalendarSkeleton() {
  return (
    <div className="space-y-4" dir="rtl">
      {/* Weekday headers skeleton */}
      <div className="grid grid-cols-7 gap-2.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 rounded-xl" />
        ))}
      </div>

      {/* Grid cells skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="min-h-35 p-2.5 border border-border/70 rounded-xl bg-card space-y-2.5"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="size-6 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
            <Skeleton className="h-16 rounded-lg w-full" />
            <Skeleton className="h-8 rounded-lg w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScheduleAccordionSkeleton() {
  return (
    <div className="space-y-3" dir="rtl">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 border border-border rounded-2xl bg-card flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

