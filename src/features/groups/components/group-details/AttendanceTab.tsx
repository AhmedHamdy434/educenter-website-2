import { AttendanceManagementView } from "@/features/attendance/components/AttendanceManagementView";

interface AttendanceTabProps {
  groupId: string;
}

export function AttendanceTab({ groupId }: AttendanceTabProps) {
  return <AttendanceManagementView groupId={groupId} />;
}
