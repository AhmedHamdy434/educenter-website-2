'use client';

import { useMemo } from 'react';
import { ARABIC_WEEKDAYS, getCairoTodayString } from '../../utils/date-helpers';
import { ScheduleSessionItem } from '../../types';
import { CalendarDayCell } from './CalendarDayCell';

interface CalendarGridProps {
  month: string; // YYYY-MM
  sessions: ScheduleSessionItem[];
}

export function CalendarGrid({ month, sessions }: CalendarGridProps) {
  const todayStr = getCairoTodayString();

  // Group sessions by date string (YYYY-MM-DD)
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, ScheduleSessionItem[]>();
    for (const session of sessions) {
      const list = map.get(session.date) || [];
      list.push(session);
      map.set(session.date, list);
    }
    return map;
  }, [sessions]);

  // Compute days matrix for the month
  const calendarCells = useMemo(() => {
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    // 1st day of target month
    const firstDayDate = new Date(Date.UTC(year, monthIndex, 1));
    // Number of days in target month
    const lastDayDate = new Date(Date.UTC(year, monthIndex + 1, 0));
    const daysInMonth = lastDayDate.getUTCDate();

    // Map getUTCDay() (0=Sun..6=Sat) to Saturday-first index (0=Sat..6=Fri)
    const firstDaySatIndex = (firstDayDate.getUTCDay() + 1) % 7;

    // Previous month info for padding leading cells
    const prevMonthLastDayDate = new Date(Date.UTC(year, monthIndex, 0));
    const daysInPrevMonth = prevMonthLastDayDate.getUTCDate();

    const cells: Array<{
      key: string;
      dayNumber: number;
      dayName: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isPast: boolean;
      sessions: ScheduleSessionItem[];
    }> = [];

    // Leading days from previous month
    for (let i = firstDaySatIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const cellSatIndex = (firstDaySatIndex - 1 - i) % 7;
      cells.push({
        key: `prev-${dayNum}`,
        dayNumber: dayNum,
        dayName: ARABIC_WEEKDAYS[cellSatIndex],
        isCurrentMonth: false,
        isToday: false,
        isPast: true,
        sessions: [],
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(monthIndex + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      const isToday = dateStr === todayStr;
      const isPast = dateStr < todayStr;
      const daySessions = sessionsByDate.get(dateStr) || [];
      const cellSatIndex = (firstDaySatIndex + d - 1) % 7;

      cells.push({
        key: `curr-${d}`,
        dayNumber: d,
        dayName: ARABIC_WEEKDAYS[cellSatIndex],
        isCurrentMonth: true,
        isToday,
        isPast,
        sessions: daySessions,
      });
    }

    // Trailing days to fill the final row to a multiple of 7
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let t = 1; t <= remaining; t++) {
      const cellSatIndex = (firstDaySatIndex + daysInMonth + t - 1) % 7;
      cells.push({
        key: `next-${t}`,
        dayNumber: t,
        dayName: ARABIC_WEEKDAYS[cellSatIndex],
        isCurrentMonth: false,
        isToday: false,
        isPast: false,
        sessions: [],
      });
    }

    return cells;
  }, [month, sessionsByDate, todayStr]);

  return (
    <div className="space-y-3">
      {/* 7 Columns Weekday Headers */}
      <div className="hidden 2xl:grid grid-cols-7 gap-2.5 text-center">
        {ARABIC_WEEKDAYS.map((dayName) => (
          <div
            key={dayName}
            className="py-2.5 rounded-xl bg-secondary/70 border border-border/70 text-xs font-black text-foreground shadow-xs"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Grid of Day Cells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-2.5">
        {calendarCells.map((cell) => (
          <CalendarDayCell
            key={cell.key}
            dayNumber={cell.dayNumber}
            dayName={cell.dayName}
            isToday={cell.isToday}
            isPast={cell.isPast}
            isCurrentMonth={cell.isCurrentMonth}
            sessions={cell.sessions}
          />
        ))}
      </div>
    </div>
  );
}

