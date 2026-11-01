import { CheckCircle2, Clock, Sparkles, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AttendanceSessionStatus } from "../types";

interface SessionStatusBadgeProps {
  status: AttendanceSessionStatus;
  studentsCount: number;
  recordedCount: number;
  isExtraSession?: boolean;
  isGroupInactive?: boolean;
  className?: string;
  compact?: boolean;
}

export function SessionStatusBadge({
  status,
  studentsCount,
  recordedCount,
  isExtraSession,
  isGroupInactive,
  className,
  compact = false,
}: SessionStatusBadgeProps) {
  if (compact) {
    return (
      <div
        className={cn("flex items-center gap-1 min-w-0 flex-wrap", className)}
      >
        {isGroupInactive && (
          <Badge
            variant="outline"
            className="border-red-300 bg-red-50 text-red-700 text-[9px] font-bold px-1.5 py-0 h-4 flex items-center gap-0.5"
            title="مجموعة موقوفة"
          >
            <Ban className="size-2.5 shrink-0" />
          </Badge>
        )}

        {isExtraSession && (
          <Badge
            variant="outline"
            className="border-amber-400 bg-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0 h-4 flex items-center gap-0.5"
            title="حصة إضافية"
          >
            <Sparkles className="size-2.5 shrink-0" />
          </Badge>
        )}

        {studentsCount === 0 ? (
          <Badge
            variant="outline"
            className="border-border bg-secondary/50 text-muted-foreground text-[9px] font-semibold px-1.5 py-0 h-4"
          ></Badge>
        ) : status === "COMPLETED" ? (
          <Badge
            variant="outline"
            className="border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[9.5px] font-bold px-1.5 py-0 h-4 flex items-center gap-1 shadow-none"
            title={`مكتملة (${recordedCount}/${studentsCount})`}
          >
            <span>
              ({recordedCount}/{studentsCount})
            </span>
          </Badge>
        ) : status === "IN_PROGRESS" ? (
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 text-[9.5px] font-bold px-1.5 py-0 h-4 flex items-center gap-1 shadow-none"
            title={`قيد التحضير (${recordedCount}/${studentsCount})`}
          >
            <Clock className="size-2.5 text-amber-600 shrink-0" />
            <span>
              ({recordedCount}/{studentsCount})
            </span>
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-border bg-stone-100/70 text-stone-700 dark:bg-stone-900/60 dark:text-stone-300 text-[9.5px] font-medium px-1.5 py-0 h-4 flex items-center gap-1 shadow-none"
          >
            <Clock className="size-2.5 text-stone-400 shrink-0" />
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {isGroupInactive && (
        <Badge
          variant="outline"
          className="border-red-300 bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 flex items-center gap-1"
        >
          <Ban className="size-3" />
          <span>مجموعة موقوفة</span>
        </Badge>
      )}

      {isExtraSession && (
        <Badge
          variant="outline"
          className="border-amber-400 bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 flex items-center gap-1"
        >
          <Sparkles className="size-3" />
          <span>حصة إضافية</span>
        </Badge>
      )}

      {studentsCount === 0 ? (
        <Badge
          variant="outline"
          className="border-border bg-secondary/50 text-muted-foreground text-[11px] font-semibold px-2 py-0.5"
        >
          <span>لا يوجد طلاب</span>
        </Badge>
      ) : status === "COMPLETED" ? (
        <Badge
          variant="outline"
          className="border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-none"
        >
          <CheckCircle2 className="size-3 text-emerald-600" />
          <span>
            مكتملة ({recordedCount}/{studentsCount})
          </span>
        </Badge>
      ) : status === "IN_PROGRESS" ? (
        <Badge
          variant="outline"
          className="border-amber-500/40 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 text-[11px] font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-none"
        >
          <Clock className="size-3 text-amber-600" />
          <span>
            قيد التحضير ({recordedCount}/{studentsCount})
          </span>
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-border bg-stone-100/70 text-stone-700 dark:bg-stone-900/60 dark:text-stone-300 text-[11px] font-semibold px-2.5 py-0.5 flex items-center gap-1 shadow-none"
        >
          <Clock className="size-3 text-stone-400" />
          <span>لم تبدأ</span>
        </Badge>
      )}
    </div>
  );
}
