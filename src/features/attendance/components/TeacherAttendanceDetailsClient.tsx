"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CalendarCheck, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGroupQuery } from "@/features/groups/hooks/queries";
import { AttendanceTab } from "@/features/groups/components/group-details/AttendanceTab";
import { type GroupDetails } from "@/features/groups/types";
import { type ApiResponse } from "@/types";

interface TeacherAttendanceDetailsClientProps {
  initialGroupData: ApiResponse<GroupDetails>;
}

export function TeacherAttendanceDetailsClient({
  initialGroupData,
}: TeacherAttendanceDetailsClientProps) {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;
  const attendanceHref = `/${centerSlug}/teacher/attendance`;

  // Load group details with TanStack Query
  const { data: groupResponse } = useGroupQuery(
    initialGroupData.data.id,
    true
  );

  const group = groupResponse?.data || initialGroupData.data;

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href={attendanceHref}
              className="hover:text-foreground transition-colors font-semibold"
            >
              التحضير والغياب
            </Link>
            <span>/</span>
            <span className="text-foreground font-bold">كشف حضور المجموعة</span>
          </div>

          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <CalendarCheck className="size-6 text-primary" />
            كشف حضور وغياب: {group.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1 font-medium">
              <GraduationCap className="size-3.5" />
              {group.grade.name}
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="size-3.5" />
              {group.students.length} طالب مسجل
            </span>
            <span className="text-border">•</span>
            <span className="font-medium">المادة: {group.subject.name}</span>
          </div>
        </div>

        <div>
          <Button
            asChild
            variant="outline"
            className="h-9 px-4 rounded-lg border-border text-foreground hover:bg-muted font-semibold flex items-center gap-2"
          >
            <Link href={attendanceHref}>
              <ArrowRight className="size-4" />
              <span>رجوع للمجموعات</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card rounded-2xl border border-border shadow-none p-6">
        <AttendanceTab
          groupId={group.id}
          totalStudents={group.students.length}
        />
      </div>
    </div>
  );
}
