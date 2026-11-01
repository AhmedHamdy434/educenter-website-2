'use client';

import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduleSessionItem } from '../../types';
import { formatDateArabic, getCairoTodayString } from '../../utils/date-helpers';
import { AccordionSessionCard } from './AccordionSessionCard';

interface AccordionDayItemProps {
  dateStr: string;
  sessions: ScheduleSessionItem[];
  defaultOpen?: boolean;
}

export function AccordionDayItem({
  dateStr,
  sessions,
  defaultOpen = false,
}: AccordionDayItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const todayStr = getCairoTodayString();
  const isToday = dateStr === todayStr;

  const formattedDate = formatDateArabic(dateStr);

  return (
    <div
      className={cn(
        'border rounded-2xl transition-all overflow-hidden text-right',
        isToday
          ? 'border-amber-500/80 bg-amber-500/2 shadow-xs'
          : 'border-border bg-card',
      )}
      dir="rtl"
    >
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-secondary/40 transition-colors text-right select-none"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'size-10 rounded-xl flex items-center justify-center shrink-0 border',
              isToday
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-secondary text-primary border-border',
            )}
          >
            <Calendar className="size-5" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
            <span className="font-black text-sm text-foreground">
              {isToday ? `اليوم — ${formattedDate}` : formattedDate}
            </span>
            {isToday && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded-md self-start sm:self-auto">
                اليوم الحالي
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border/60">
            {sessions.length} {sessions.length === 1 ? 'حصة' : 'حصص'}
          </span>
          <div
            className={cn(
              'size-8 rounded-lg flex items-center justify-center text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          >
            <ChevronDown className="size-4.5" />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-border/50 space-y-3 bg-secondary/15 animate-fade-in">
          {sessions.map((session) => (
            <AccordionSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

