"use client";

import { useMemo } from "react";
import { UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SharedTable } from "@/components/common/SharedTable";
import { AttendanceStatus } from "@/features/attendance/types";
import {
  getAttendancePresentColumns,
  type PresentStudentItem,
} from "./attendance-present-columns";

interface AttendancePresentListProps {
  students: PresentStudentItem[];
  highlightedStudentId: string | null;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onReasonChange: (studentId: string, reason: string) => void;
  onResetStudent: (studentId: string) => void;
}

export function AttendancePresentList({
  students,
  highlightedStudentId,
  onStatusChange,
  onReasonChange,
  onResetStudent,
}: AttendancePresentListProps) {
  const columns = useMemo(
    () =>
      getAttendancePresentColumns({
        onStatusChange,
        onReasonChange,
        onResetStudent,
      }),
    [onStatusChange, onReasonChange, onResetStudent],
  );

  return (
    <div className="space-y-3">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <UserCheck className="size-4.5 text-emerald-600" />
          <span>الطلاب الحاضرون والمسجلون</span>
          <Badge
            variant="subtle"
            className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
          >
            {students.length}
          </Badge>
        </h3>
      </div>

      {students.length > 0 ? (
        <SharedTable
          columns={columns}
          data={students}
          hidePagination={true}
          getRowId={(row) => row.studentId}
          rowClassName={(row) =>
            row.original.studentId === highlightedStudentId
              ? "bg-emerald-50/60 dark:bg-emerald-950/30 transition-colors"
              : ""
          }
        />
      ) : (
        <div className="text-center py-10 px-4 border border-dashed border-border rounded-xl bg-secondary/10">
          <UserX className="size-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-xs font-bold text-foreground">
            لم يتم تسجيل حضور أي طالب حتى الآن
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            امسح كود الطالب بالماسح أو ابحث عنه بالأعلى، أو اختر &quot;تسجيل
            حضور&quot; من القائمة بالأسفل.
          </p>
        </div>
      )}
    </div>
  );
}
