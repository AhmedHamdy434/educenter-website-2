import type { Metadata } from 'next';
import { ScheduleAttendanceClient } from '@/features/schedule/components/ScheduleAttendanceClient';

interface PageProps {
  params: Promise<{ centerSlug: string; groupId: string }>;
}

export const metadata: Metadata = {
  title: 'تسجيل حضور الحصة | مدير المركز',
  description: 'تسجيل وتوثيق حضور وغياب الطلاب للحصة المجدولة.',
};

export default async function ScheduleAttendancePage({ params }: PageProps) {
  const { groupId } = await params;

  return <ScheduleAttendanceClient groupId={groupId} />;
}

