import type { Metadata } from 'next';
import { ScheduleViewClient } from '@/features/schedule/components/ScheduleViewClient';

export const metadata: Metadata = {
  title: 'جدول الحصص | مدير المركز',
  description: 'عرض ومتابعة جدول الحصص الأسبوعي والشهري وإدارة تحضير الحضور.',
};

export default function SchedulePage() {
  return <ScheduleViewClient />;
}

