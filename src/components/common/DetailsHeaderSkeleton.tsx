import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DetailsHeaderSkeletonProps {
  hasBreadcrumbs?: boolean;
  hasBadge?: boolean;
  hasActionButton?: boolean;
  className?: string;
}

export function DetailsHeaderSkeleton({
  hasBreadcrumbs = true,
  hasBadge = true,
  hasActionButton = true,
  className,
}: DetailsHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-4 text-right border-b border-border pb-5 animate-fade-in",
        className,
      )}
      dir="rtl"
      aria-busy="true"
      aria-label="جاري تحميل ترويسة الصفحة"
    >
      {/* 1. مسار التنقل (Breadcrumbs Navigation Skeleton) */}
      {hasBreadcrumbs && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-24 rounded" />
          <ChevronRight className="size-3.5 text-muted-foreground/30 rotate-180" />
          <Skeleton className="h-3.5 w-32 rounded" />
        </div>
      )}

      {/* 2. حاوية العنوان والإجراءات (Main Title & Action Container) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* عنوان الكيان وشارة الحالة */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
            {hasBadge && <Skeleton className="h-5 w-16 rounded-full" />}
          </div>
          {/* الوصف التعريفي */}
          <Skeleton className="h-3.5 w-72 sm:w-96 rounded" />
        </div>

        {/* زر الإجراء الأساسي في الترويسة */}
        {hasActionButton && (
          <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
        )}
      </div>
    </div>
  );
}
