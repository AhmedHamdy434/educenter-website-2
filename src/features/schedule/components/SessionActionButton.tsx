'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Play, FileText, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStartAttendanceSessionMutation } from '@/features/attendance/hooks/mutations';
import { useSubscriptionStore } from '@/features/subscription/state/useSubscriptionStore';
import { ScheduleSessionItem } from '../types';
import { getCairoTodayString } from '../utils/date-helpers';

interface SessionActionButtonProps {
  session: ScheduleSessionItem;
  size?: 'sm' | 'default';
  iconOnly?: boolean;
}

export function SessionActionButton({
  session,
  size = 'sm',
  iconOnly = false,
}: SessionActionButtonProps) {
  const router = useRouter();
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;

  const [isStarting, setIsStarting] = useState(false);
  const startSessionMutation = useStartAttendanceSessionMutation();
  const isExpired = useSubscriptionStore((state) => state.isExpired);

  const todayStr = getCairoTodayString();
  const isFuture = session.date > todayStr;
  const isPast = session.date < todayStr;

  // Handler for navigation to attendance session
  const navigateToAttendance = (targetSessionId?: string | null) => {
    const url = targetSessionId
      ? `/${centerSlug}/owner/schedule/attendance/${session.groupId}/${targetSessionId}`
      : `/${centerSlug}/owner/schedule/attendance/${session.groupId}`;
    router.push(url);
  };

  // 1. If an AttendanceSession already exists
  if (session.sessionId) {
    const isCompleted = session.attendanceStatus === 'COMPLETED';

    return (
      <Button
        variant={isCompleted ? 'outline' : 'secondary'}
        size={size}
        onClick={() => navigateToAttendance(session.sessionId)}
        title={isCompleted ? 'عرض الحضور' : 'استكمال الحضور'}
        aria-label={isCompleted ? 'عرض الحضور' : 'استكمال الحضور'}
        className={cn(
          'rounded-md font-bold cursor-pointer hover:bg-secondary border-border',
          iconOnly
            ? 'size-6 p-0 flex items-center justify-center'
            : 'text-xs h-8 px-3 flex items-center gap-1.5',
        )}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className={cn('text-emerald-600', iconOnly ? 'size-3.5' : 'size-3.5')} />
            {!iconOnly && <span>عرض الحضور</span>}
          </>
        ) : (
          <>
            <FileText className={cn('text-primary', iconOnly ? 'size-3.5' : 'size-3.5')} />
            {!iconOnly && <span>استكمال الحضور</span>}
          </>
        )}
      </Button>
    );
  }

  // 2. If no session exists:
  // 2.1 Group has no students
  if (session.studentsCount === 0) {
    return (
      <div className="relative group inline-block">
        <Button
          variant="outline"
          size={size}
          disabled
          title="بدء الحصة (غير متاح لعدم وجود طلاب)"
          aria-label="بدء الحصة (غير متاح لعدم وجود طلاب)"
          className={cn(
            'rounded-md font-semibold cursor-not-allowed opacity-50 border-dashed',
            iconOnly
              ? 'size-6 p-0 flex items-center justify-center'
              : 'text-xs h-8 px-3',
          )}
        >
          {iconOnly ? <Play className="size-3 text-muted-foreground" /> : <span>بدء الحصة</span>}
        </Button>
        <div className="absolute bottom-full mb-1.5 right-1/2 translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap rounded-md bg-stone-900 px-2.5 py-1 text-[11px] text-white shadow-md">
          لا يمكن بدء الحصة لعدم وجود طلاب في المجموعة
        </div>
      </div>
    );
  }

  // 2.2 Past day without session -> "لم تُسجَّل" (not clickable, no start button)
  if (isPast) {
    if (iconOnly) {
      return (
        <span
          className="size-6 rounded-md bg-secondary/60 border border-border/40 inline-flex items-center justify-center text-[10px] text-muted-foreground font-semibold"
          title="لم تُسجَّل"
        >
          —
        </span>
      );
    }
    return (
      <span className="text-[11px] text-muted-foreground font-semibold px-2 py-1 bg-secondary/60 rounded-md border border-border/40 inline-flex items-center">
        لم تُسجَّل
      </span>
    );
  }

  // 2.3 Future day -> Disabled button with Tooltip "الحصة لم يحن موعدها"
  if (isFuture) {
    return (
      <div className="relative group inline-block">
        <Button
          variant="outline"
          size={size}
          disabled
          title="الحصة لم يحن موعدها"
          aria-label="الحصة لم يحن موعدها"
          className={cn(
            'rounded-md font-semibold cursor-not-allowed opacity-50 border-dashed',
            iconOnly
              ? 'size-6 p-0 flex items-center justify-center'
              : 'text-xs h-8 px-3 flex items-center gap-1.5',
          )}
        >
          <Lock className="size-3" />
          {!iconOnly && <span>بدء الحصة</span>}
        </Button>
        <div className="absolute bottom-full mb-1.5 right-1/2 translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap rounded-md bg-stone-900 px-2.5 py-1 text-[11px] text-white shadow-md">
          الحصة لم يحن موعدها
        </div>
      </div>
    );
  }

  // 2.4 Today's session -> "بدء الحصة" (Active unless subscription expired)
  const handleStartTodaySession = async () => {
    if (isExpired || isStarting) return;
    setIsStarting(true);
    try {
      const res = await startSessionMutation.mutateAsync(session.groupId);
      if (res.success && res.data) {
        navigateToAttendance(res.data.id);
      }
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="relative group inline-block">
      <Button
        variant="brand"
        size={size}
        disabled={isStarting || isExpired}
        onClick={handleStartTodaySession}
        title="بدء الحصة"
        aria-label="بدء الحصة"
        className={cn(
          'rounded-md font-bold shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
          iconOnly
            ? 'size-6 p-0 flex items-center justify-center'
            : 'text-xs h-8 px-3.5 flex items-center gap-1.5',
        )}
      >
        {isStarting ? (
          <Loader2 className={cn('animate-spin', iconOnly ? 'size-3' : 'size-3.5')} />
        ) : (
          <Play className={cn('fill-primary-foreground', iconOnly ? 'size-2.5' : 'size-3')} />
        )}
        {!iconOnly && (
          <span>{isStarting ? 'جاري البدء...' : 'بدء الحصة'}</span>
        )}
      </Button>

      {isExpired && (
        <div className="absolute bottom-full mb-1.5 right-1/2 translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap rounded-md bg-stone-900 px-2.5 py-1 text-[11px] text-white shadow-md">
          اشتراك المركز منتهي، يرجى التجديد لاستئناف العمليات
        </div>
      )}
    </div>
  );
}

