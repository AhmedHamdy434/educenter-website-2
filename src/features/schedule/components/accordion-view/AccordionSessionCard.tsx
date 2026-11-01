import { Clock, User, BookOpen, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScheduleSessionItem } from '../../types';
import { formatHourMinuteArabic } from '../../utils/date-helpers';
import { SessionStatusBadge } from '../SessionStatusBadge';
import { SessionActionButton } from '../SessionActionButton';

interface AccordionSessionCardProps {
  session: ScheduleSessionItem;
}

export function AccordionSessionCard({ session }: AccordionSessionCardProps) {
  const formattedTime = formatHourMinuteArabic(session.hour, session.minute);

  return (
    <Card
      className={cn(
        'p-4 rounded-xl border transition-all text-right bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-none hover:shadow-xs',
        session.isGroupInactive
          ? 'opacity-70 border-dashed border-red-200'
          : 'border-border',
      )}
      dir="rtl"
    >
      {/* Right Column: Time & Group Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Time block */}
        <div className="flex sm:flex-col items-center justify-center gap-1 bg-secondary/60 border border-border/70 rounded-xl px-3.5 py-2.5 min-w-22.5 shrink-0">
          <Clock className="size-4 text-primary" />
          <span className="font-black text-xs text-foreground" dir="ltr">
            {formattedTime}
          </span>
        </div>

        {/* Group details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground">
              {session.groupName}
            </h4>
            <SessionStatusBadge
              status={session.attendanceStatus}
              studentsCount={session.studentsCount}
              recordedCount={session.recordedCount}
              isExtraSession={session.isExtraSession}
              isGroupInactive={session.isGroupInactive}
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap font-medium">
            <span className="flex items-center gap-1">
              <Layers className="size-3 text-primary/70" />
              <span>{session.grade.name}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3 text-primary/70" />
              <span>{session.subject.name}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="size-3 text-primary/70" />
              <span>{session.teacher.fullName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Left Column: Action Button */}
      <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
        <SessionActionButton session={session} size="default" />
      </div>
    </Card>
  );
}

