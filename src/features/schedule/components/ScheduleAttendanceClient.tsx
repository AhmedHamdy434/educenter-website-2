"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowRight, CalendarCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttendanceManagementView } from "@/features/attendance/components/AttendanceManagementView";
import { useGroupQuery } from "@/features/groups/hooks/queries";

interface ScheduleAttendanceClientProps {
  groupId: string;
  sessionId?: string;
}

export function ScheduleAttendanceClient({
  groupId,
  sessionId,
}: ScheduleAttendanceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;

  // Fetch group details for header info
  const { data: groupResponse } = useGroupQuery(groupId);
  const group = groupResponse?.data;

  const handleBackToSchedule = () => {
    // Preserve any existing filter / month params when returning
    const currentParams = new URLSearchParams(searchParams.toString());
    const queryStr = currentParams.toString();
    router.push(`/${centerSlug}/owner/schedule${queryStr ? `?${queryStr}` : ""}`);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToSchedule}
            className="rounded-xl flex items-center gap-2 font-bold text-xs h-9 cursor-pointer hover:bg-secondary/70 border-border"
          >
            <ArrowRight className="size-4" />
            <span>رجوع إلى جدول الحصص</span>
          </Button>

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <CalendarCheck className="size-3.5 text-primary" />
            <span>جدول الحصص</span>
            <span>/</span>
            <span className="text-foreground font-bold">
              {group?.name || "تحضير حضور المجموعة"}
            </span>
          </div>
        </div>

        {group && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/60 self-start sm:self-auto">
            <BookOpen className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{group.grade?.name}</span>
            <span>•</span>
            <span className="font-semibold text-foreground">{group.subject?.name}</span>
            <span>•</span>
            <span>{group.teacher?.user?.fullName}</span>
          </div>
        )}
      </div>

      {/* Reusable Attendance Management View */}
      <AttendanceManagementView
        groupId={groupId}
        initialSessionId={sessionId}
        onBack={handleBackToSchedule}
      />
    </div>
  );
}
