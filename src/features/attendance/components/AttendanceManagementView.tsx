"use client";

import { useState, useMemo } from "react";
import { CalendarCheck, Calendar } from "lucide-react";
import { SharedTable } from "@/components/common/SharedTable";
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
  const { data: response, isLoading } =
    useGroupAttendanceSessionsQuery(groupId);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* History log title */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar className="size-4.5 text-primary" />
          سجل الحصص السابقة ({sessions.length})
        </h3>

        {/* Sessions table list */}
        {sessions.length > 0 || isLoading ? (
          <SharedTable
            columns={columns}
            data={sessions}
            isLoading={isLoading}
            hidePagination={true}
            emptyMessage="لم تقم بتسجيل حضور أي حصة لهذه المجموعة حتى الآن."
          />
        ) : (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
            <CalendarCheck className="size-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-bold text-foreground text-sm">
              سجل حضور الحصص فارغ
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              لم تقم بتسجيل حضور أي حصة لهذه المجموعة حتى الآن. اضغط على الزر
              أعلاه لتسجيل حضور حصة اليوم.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
