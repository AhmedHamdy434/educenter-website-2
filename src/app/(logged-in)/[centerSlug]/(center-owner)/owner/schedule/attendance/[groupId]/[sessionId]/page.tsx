import type { Metadata } from 'next';
import { ScheduleAttendanceClient } from '@/features/schedule/components/ScheduleAttendanceClient';

interface PageProps {
  params: Promise<{ centerSlug: string; groupId: string; sessionId: string }>;
}

export const metadata: Metadata = {
  title: 'تسجيل حضور الحصة | مدير المركز',
  description: 'تسجيل وتوثيق حضور وغياب الطلاب للحصة المجدولة.',
};

export default async function ScheduleSessionAttendancePage({
  params,
}: PageProps) {
  const { groupId, sessionId } = await params;

  return (
    <ScheduleAttendanceClient groupId={groupId} sessionId={sessionId} />
  );
}

