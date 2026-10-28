"use client";

import { useState, useMemo } from "react";
import { CalendarCheck, Calendar, Play, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SharedTable } from "@/components/common/SharedTable";
import { useGroupAttendanceSessionsQuery } from "@/features/attendance/hooks/queries";
import { useStartAttendanceSessionMutation } from "@/features/attendance/hooks/mutations";
import { AttendanceRecorder } from "./AttendanceRecorder";
import { getAttendanceSessionsColumns } from "./attendance-sessions-columns";

interface AttendanceTabProps {
  groupId: string;
}

export function AttendanceTab({ groupId }: AttendanceTabProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // 1. Fetch sessions list
  const { data: response, isLoading } =
    useGroupAttendanceSessionsQuery(groupId);
  const startSessionMutation = useStartAttendanceSessionMutation();

  const sessions = response?.data || [];
  const columns = useMemo(
    () =>
      getAttendanceSessionsColumns({
        onEditSession: (id) => setActiveSessionId(id),
      }),
    [],
  );

  // Handler to start/reopen today's session
  const handleStartTodaySession = async () => {
    await startSessionMutation.mutateAsync(groupId, {
      onSuccess: (res) => {
        if (res.success && res.data) {
          setActiveSessionId(res.data.id);
        }
      },
    });
  };

  // If a session is open, render the recorder
  if (activeSessionId) {
    return (
      <AttendanceRecorder
        groupId={groupId}
        sessionId={activeSessionId}
        onBack={() => setActiveSessionId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in">
      {/* Top Banner / Call to Action */}
      <Card className="p-6 bg-secondary/40 border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-none">
        <div className="flex gap-4 items-start">
          <div className="size-12 rounded-xl bg-card border border-border text-primary flex items-center justify-center shrink-0 shadow-none">
            <CalendarCheck className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">
              حضور وغياب حصة اليوم
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-medium">
              يمكنك بدء وتوثيق حضور الطلاب لحصة اليوم الحالي. يقوم النظام
              تلقائياً بإنشاء جلسة تحضير حضور لليوم، أو فتح الجلسة الحالية إذا
              كانت منشأة مسبقاً.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartTodaySession}
          disabled={startSessionMutation.isPending}
          variant="brand"
          className="h-10 px-6 rounded-xl flex items-center gap-2 font-bold shadow-none whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          {startSessionMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              جاري فتح الحصة...
            </>
          ) : (
            <>
              <Play className="size-4 fill-primary-foreground" />
              بدء تحضير حصة اليوم
            </>
          )}
        </Button>
      </Card>

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
