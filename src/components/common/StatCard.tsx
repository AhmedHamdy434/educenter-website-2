import type { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  unit?: string;
  icon?: LucideIcon;
  variant?: "default" | "primary";
  textClassName?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  variant = "default",
  className,
  textClassName,
  ...props
}: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <Card
      className={cn(
        "relative flex h-full min-w-0 flex-col gap-5 overflow-hidden rounded-xl border p-5 shadow-none transition-colors",
        isPrimary ? "border-primary/25 bg-primary/5" : "border-border bg-card",
        className,
      )}
      {...props}
    >
      {/* Header: Icon + Label */}
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              isPrimary
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <Icon className="size-5" strokeWidth={2} />
          </div>
        )}

        <p
          className={cn(
            "min-w-0 text-sm font-medium leading-6",
            isPrimary ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      </div>

      {/* Value */}
      <div className="flex min-w-0 items-baseline gap-2">
        <span
          className={cn(
            "min-w-0 wrap-break-word font-bold tracking-tight tabular-nums",
            isPrimary ? "text-3xl text-primary" : "text-2xl text-foreground",
            textClassName,
          )}
        >
          {value}
        </span>

        {unit && (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </Card>
  );
}
export const StatCardSkeleton = () => {
  return (
    <Card className="flex h-full min-w-0 flex-col gap-5 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-none">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-3.5 w-14 rounded" />
      </div>
    </Card>
  );
};
