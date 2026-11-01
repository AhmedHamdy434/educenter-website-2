"use client";

import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScheduleViewMode } from "../types";
import {
  formatMonthArabic,
  getNextMonth,
  getPrevMonth,
  getCairoCurrentMonth,
} from "../utils/date-helpers";

interface ScheduleHeaderProps {
  month: string;
  onMonthChange: (newMonth: string) => void;
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
}

export function ScheduleHeader({
  month,
  onMonthChange,
  viewMode,
  onViewModeChange,
}: ScheduleHeaderProps) {
  const currentMonth = getCairoCurrentMonth();
  const isCurrentMonth = month === currentMonth;

  const handlePrevMonth = () => {
    onMonthChange(getPrevMonth(month));
  };

  const handleNextMonth = () => {
    onMonthChange(getNextMonth(month));
  };

  const handleGoToday = () => {
    onMonthChange(currentMonth);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Month Navigator (Available in both modes, especially Calendar) */}
      {viewMode === "calendar" && (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-xs">
            {/* In RTL: Right arrow moves to PREVIOUS month */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              aria-label="الشهر السابق"
              className="size-8 rounded-lg cursor-pointer hover:bg-secondary text-foreground"
            >
              <ChevronRight className="size-4" />
            </Button>

            {/* Month Label */}
            <div className="px-4 text-sm font-black text-foreground min-w-32.5 text-center select-none">
              {formatMonthArabic(month)}
            </div>

            {/* In RTL: Left arrow moves to NEXT month */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              aria-label="الشهر التالي"
              className="size-8 rounded-lg cursor-pointer hover:bg-secondary text-foreground"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>

          {/* Today quick button */}
          {!isCurrentMonth && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToday}
              className="h-10 px-3.5 rounded-xl font-bold text-xs border-border bg-card hover:bg-secondary cursor-pointer shadow-xs"
            >
              الشهر الحالي
            </Button>
          )}
        </div>
      )}

      {/* Mode Switcher Toggle: Calendar vs Accordion */}
      <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-border/80 self-start sm:self-auto ms-auto shadow-xs">
        <button
          type="button"
          onClick={() => onViewModeChange("calendar")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none",
            viewMode === "calendar"
              ? "bg-card text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <CalendarIcon className="size-3.5" />
          <span>تقويم شهري</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("accordion")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none",
            viewMode === "accordion"
              ? "bg-card text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <CalendarDays className="size-3.5" />
          <span>حصص قادمة</span>
        </button>
      </div>
    </div>
  );
}
