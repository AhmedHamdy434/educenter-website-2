"use client";

import { useState, useMemo } from "react";
import { CalendarCheck, Calendar } from "lucide-react";
import { SharedTable } from "@/components/common/SharedTable";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useGroupAttendanceSessionsQuery } from "@/features/attendance/hooks/queries";
import { AttendanceRecorder } from "@/features/groups/components/group-details/AttendanceRecorder";
import { getAttendanceSessionsColumns } from "@/features/groups/components/group-details/attendance-sessions-columns";

export interface AttendanceManagementViewProps {
  groupId: string;
  initialSessionId?: string | null;
  onBack?: () => void;
}

export function AttendanceManagementView({
  groupId,
  initialSessionId = null,
  onBack,
}: AttendanceManagementViewProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId,
  );

  // 1. Fetch sessions list
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupAttendanceSessionsQuery(groupId);

  const sessions = response?.data || [];
  const columns = useMemo(
    () =>
      getAttendanceSessionsColumns({
        onEditSession: (id) => setActiveSessionId(id),
      }),
    [],
  );

  // If a session is open, render the recorder
  if (activeSessionId) {
    return (
      <AttendanceRecorder
        groupId={groupId}
        sessionId={activeSessionId}
        onBack={() => {
          setActiveSessionId(null);
          if (onBack && initialSessionId) {
            onBack();
          }
        }}
      />
    );
  }

  if (isError) {
    return (
      <QueryErrorState
        title="تعذر تحميل سجل الحصص"
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* History log title */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar className="size-4.5 text-primary" />
          سجل الحصص السابقة ({sessions.length})
        </h3>

        {/* Sessions table list */}
        <SharedTable
          columns={columns}
          data={sessions}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          hidePagination={true}
          emptyTitle="سجل حضور الحصص فارغ"
          emptyDescription="لم تقم بتسجيل حضور أي حصة لهذه المجموعة حتى الآن."
          emptyIcon={CalendarCheck}
        />
      </div>
    </div>
  );
}
