"use client";

import { CalendarCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleSessionItem } from "../../types";
import { getCairoTodayString } from "../../utils/date-helpers";
import { AccordionDayItem } from "./AccordionDayItem";

interface ScheduleAccordionProps {
  sessions: ScheduleSessionItem[];
  onGoToNextMonth?: () => void;
}

export function ScheduleAccordion({
  sessions,
  onGoToNextMonth,
}: ScheduleAccordionProps) {
  const todayStr = getCairoTodayString();

  // 1. Group sessions by date for dates >= today

  const map = new Map<string, ScheduleSessionItem[]>();

  for (const session of sessions) {
    // Accordion strictly shows sessions from today onwards
    if (session.date >= todayStr) {
      const list = map.get(session.date) || [];
      list.push(session);
      map.set(session.date, list);
    }
  }

  // Sort by date ascending
  const sortedDates = Array.from(map.keys()).sort();

  const groupedDays = sortedDates.map((dateStr) => ({
    dateStr,
    sessions: map.get(dateStr) || [],
  }));

  if (groupedDays.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/15 space-y-4 max-w-lg mx-auto p-6">
        <div className="size-14 mx-auto rounded-2xl bg-secondary border border-border text-muted-foreground flex items-center justify-center">
          <CalendarCheck className="size-7 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground">
            لا توجد حصص متبقية في هذا الشهر
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            تم الانتهاء من جميع الحصص المجدولة لباقي أيام الشهر الحالي، أو لم
            تُسجَّل مجموعات لهذا الشهر.
          </p>
        </div>

        {onGoToNextMonth && (
          <Button
            variant="brand"
            size="sm"
            onClick={onGoToNextMonth}
            className="rounded-xl font-bold text-xs h-9 px-5 gap-2 cursor-pointer shadow-xs"
          >
            <span>عرض الشهر الجاي</span>
            <ArrowLeft className="size-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3" dir="rtl">
      {groupedDays.map((item, index) => (
        <AccordionDayItem
          key={item.dateStr}
          dateStr={item.dateStr}
          sessions={item.sessions}
          defaultOpen={index === 0} // First day (Today) open by default
        />
      ))}
    </div>
  );
}
