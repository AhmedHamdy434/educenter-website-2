import { cn } from '@/lib/utils';
import { ScheduleSessionItem } from '../../types';
import { CalendarSessionCard } from './CalendarSessionCard';

interface CalendarDayCellProps {
  dayNumber: number;
  dayName?: string;
  isToday: boolean;
  isPast: boolean;
  isCurrentMonth: boolean;
  sessions: ScheduleSessionItem[];
}

export function CalendarDayCell({
  dayNumber,
  dayName,
  isToday,
  isPast,
  isCurrentMonth,
  sessions,
}: CalendarDayCellProps) {
  if (!isCurrentMonth) {
    return (
      <div className="min-h-28 p-2 bg-secondary/15 border border-border/40 rounded-xl opacity-30 select-none hidden lg:block">
        <span className="text-xs font-bold text-muted-foreground">
          {dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-28 p-2 sm:p-2.5 border rounded-xl flex flex-col justify-between transition-colors text-right relative',
        isToday
          ? 'border-amber-500 bg-amber-500/5 shadow-xs ring-1 ring-amber-500/40'
          : isPast
            ? 'border-border/70 bg-stone-50/50 dark:bg-stone-950/20'
            : 'border-border bg-card',
      )}
      dir="rtl"
    >
      {/* Day Header: Day Number + Today Badge + Day Name */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center justify-center size-6 text-xs font-black rounded-lg',
              isToday
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-foreground bg-secondary/80',
            )}
          >
            {dayNumber}
          </span>
          {isToday && (
            <span className="text-[10px] font-black text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-1.5 py-0.5 rounded-md">
              اليوم
            </span>
          )}
        </div>

        {dayName && (
          <span className="text-[10.5px] font-bold text-muted-foreground bg-secondary/70 px-1.5 py-0.5 rounded-md">
            {dayName}
          </span>
        )}
      </div>

      {/* Sessions Container */}
      <div className="space-y-1.5 flex-1 flex flex-col">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <CalendarSessionCard key={session.id} session={session} />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-center py-2.5">
            <span className="text-[11px] text-muted-foreground/45 font-medium">
              لا توجد حصص
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

