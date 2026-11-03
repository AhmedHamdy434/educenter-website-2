"use client";

import { CalendarCheck, ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
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
      <EmptyState
        icon={CalendarCheck}
        title="لا توجد حصص متبقية في هذا الشهر"
        description="تم الانتهاء من جميع الحصص المجدولة لباقي أيام الشهر الحالي، أو لم تُسجَّل مجموعات لهذا الشهر."
        action={
          onGoToNextMonth
            ? {
                label: "عرض الشهر القادم",
                onClick: onGoToNextMonth,
                icon: ArrowLeft,
              }
            : undefined
        }
        className="border border-dashed border-border rounded-2xl bg-secondary/15 my-6 max-w-lg mx-auto py-16"
      />
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
