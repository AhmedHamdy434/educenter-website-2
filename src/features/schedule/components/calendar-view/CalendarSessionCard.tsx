import { Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScheduleSessionItem } from "../../types";
import { formatHourMinuteArabic } from "../../utils/date-helpers";
import { SessionActionButton } from "../SessionActionButton";

interface CalendarSessionCardProps {
  session: ScheduleSessionItem;
}

export function CalendarSessionCard({ session }: CalendarSessionCardProps) {
  const formattedTime = formatHourMinuteArabic(session.hour, session.minute);

  // تحديد خلفية وإطار البطاقة بحسب نوع وحالة الحصة
  const cardStyle = (() => {
    // 1. مجموعة موقوفة
    if (session.isGroupInactive) {
      return "opacity-75 border-dashed border-red-300 bg-red-50/40 dark:bg-red-950/20 hover:border-red-400";
    }
    // 2. حصة إضافية (أمبر هادئ)
    if (session.isExtraSession) {
      return "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-400";
    }
    // 3. حصة مكتملة الحضور (أخضر هادئ)
    if (session.attendanceStatus === "COMPLETED") {
      return "border-emerald-300/80 bg-emerald-50/50 dark:bg-emerald-950/25 hover:border-emerald-400 shadow-xs";
    }
    // 5. حصة عادية لم تبدأ بعد
    return "border-border/80 bg-card hover:border-primary/40 shadow-none";
  })();

  return (
    <Card
      className={cn(
        "p-1.5 rounded-md border transition-all flex flex-col gap-1 w-full relative overflow-hidden",
        cardStyle,
      )}
    >
      {/* سطر 1: الوقت + اسم المادة + علامة الحصة الإضافية */}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1 text-[10.5px] font-bold text-primary shrink-0">
          <Clock className="size-2.5 text-primary/70 shrink-0" />
          <span>{formattedTime}</span>
        </div>

        <div className="flex items-center gap-1 min-w-0 truncate">
          {session.isExtraSession && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-100/90 px-1 py-0.2 rounded shrink-0"
              title="حصة إضافية"
            >
              <Sparkles className="size-2"  />
            </span>
          )}
          <span
            className="text-[10px] font-bold text-muted-foreground truncate text-left"
            title={session.subject.name}
          >
            {session.subject.name}
          </span>
        </div>
      </div>

      {/* سطر 2: اسم المجموعة + زر الإجراء السريع */}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <h4
          className="text-[11px] font-bold text-foreground leading-tight truncate flex-1"
          title={session.groupName}
        >
          {session.groupName}
        </h4>
        <div className="shrink-0 flex items-center">
          <SessionActionButton session={session} size="sm" iconOnly />
        </div>
      </div>

      {/* سطر 3: الصف الدراسي + اسم المدرس */}
      <div className="flex items-center justify-between gap-1 min-w-0 text-[9.5px] text-muted-foreground/90">
        <div className="flex items-center gap-1 min-w-0 truncate">
          <span className="font-semibold text-foreground/80 shrink-0">
            {session.grade.name}
          </span>
          <span className="text-muted-foreground/40 shrink-0">•</span>
          <span className="truncate" title={session.teacher.fullName}>
            {session.teacher.fullName}
          </span>
        </div>
      </div>
    </Card>
  );
}
