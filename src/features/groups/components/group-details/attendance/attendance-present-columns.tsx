"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  UserCheck,
  Clock,
  ArrowRightLeft,
  XCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceStatus, SessionStudent } from "@/features/attendance/types";

export interface PresentStudentItem extends SessionStudent {
  localRecordedAt?: string;
}

interface AttendancePresentColumnsOptions {
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onReasonChange: (studentId: string, reason: string) => void;
  onResetStudent: (studentId: string) => void;
}

function ReasonCell({
  studentId,
  initialReason,
  onReasonChange,
}: {
  studentId: string;
  initialReason: string;
  onReasonChange: (studentId: string, reason: string) => void;
}) {
  const [val, setVal] = useState(initialReason);
  const [prevInitial, setPrevInitial] = useState(initialReason);

  if (prevInitial !== initialReason) {
    setPrevInitial(initialReason);
    setVal(initialReason);
  }

  return (
    <Input
      placeholder="اكتب ملاحظة..."
      value={val}
      onChange={(e) => {
        const nextVal = e.target.value;
        setVal(nextVal);
        onReasonChange(studentId, nextVal);
      }}
      className="h-8 rounded-lg text-xs border-rose-200 focus:border-rose-400 focus:ring-rose-400/10 bg-rose-50/20 dark:bg-rose-950/20 dark:border-rose-800 placeholder:text-muted-foreground max-w-55"
    />
  );
}

export function getAttendancePresentColumns({
  onStatusChange,
  onReasonChange,
  onResetStudent,
}: AttendancePresentColumnsOptions): ColumnDef<PresentStudentItem>[] {
  return [
    {
      id: "index",
      header: "#",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-semibold text-muted-foreground text-xs">
          {row.index + 1}
        </span>
      ),
    },
    {
      id: "student",
      accessorFn: (row) => row.fullName,
      header: "اسم الطالب",
      enableSorting: false,
      cell: ({ row }) => {
        const student = row.original;
        const timeDisplay =
          student.localRecordedAt ||
          (student.recordedAt
            ? new Date(student.recordedAt).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : undefined);

        return (
          <div className="flex items-center gap-3">
            <div className="size-8.5 rounded-full bg-secondary text-primary border border-border flex items-center justify-center font-bold text-xs shrink-0">
              {student.fullName.substring(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden text-right">
              <span className="font-bold text-foreground text-xs sm:text-sm truncate">
                {student.fullName}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                {student.studentCode && (
                  <Badge
                    variant="subtle"
                    className="px-1.5 py-0 text-[10px] font-mono h-4 font-semibold"
                  >
                    {student.studentCode}
                  </Badge>
                )}
                <span dir="ltr">{student.phone}</span>
                {timeDisplay && (
                  <span className="text-muted-foreground/80 font-sans">
                    • {timeDisplay}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "حالة الحضور",
      enableSorting: false,
      cell: ({ row }) => {
        const student = row.original;
        const currentStatus = student.status || AttendanceStatus.PRESENT;

        return (
          <div className="flex items-center gap-1 bg-secondary/50 border border-border p-1 rounded-lg w-fit">
            {/* PRESENT */}
            <button
              type="button"
              onClick={() =>
                onStatusChange(student.studentId, AttendanceStatus.PRESENT)
              }
              className={`py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                currentStatus === AttendanceStatus.PRESENT
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700 font-extrabold shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <UserCheck className="size-3 shrink-0" />
              <span>حاضر</span>
            </button>

            {/* LATE */}
            <button
              type="button"
              onClick={() =>
                onStatusChange(student.studentId, AttendanceStatus.LATE)
              }
              className={`py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                currentStatus === AttendanceStatus.LATE
                  ? "bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700 font-extrabold shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Clock className="size-3 shrink-0" />
              <span>متأخر</span>
            </button>

            {/* ATTENDED_ANOTHER_GROUP */}
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  student.studentId,
                  AttendanceStatus.ATTENDED_ANOTHER_GROUP,
                )
              }
              title="حضر بمجموعة أخرى"
              className={`py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                currentStatus === AttendanceStatus.ATTENDED_ANOTHER_GROUP
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-700 font-extrabold shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <ArrowRightLeft className="size-3 shrink-0" />
              <span>أخرى</span>
            </button>

            {/* ABSENT */}
            <button
              type="button"
              onClick={() =>
                onStatusChange(student.studentId, AttendanceStatus.ABSENT)
              }
              className={`py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                currentStatus === AttendanceStatus.ABSENT
                  ? "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-700 font-extrabold shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <XCircle className="size-3 shrink-0" />
              <span>غائب</span>
            </button>

            {/* EXCUSED */}
            <button
              type="button"
              onClick={() =>
                onStatusChange(student.studentId, AttendanceStatus.EXCUSED)
              }
              className={`py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                currentStatus === AttendanceStatus.EXCUSED
                  ? "bg-stone-100 text-stone-800 border border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600 font-extrabold shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <AlertCircle className="size-3 shrink-0" />
              <span>مستأذن</span>
            </button>
          </div>
        );
      },
    },
    {
      id: "reason",
      header: "ملاحظات / سبب الغياب",
      enableSorting: false,
      cell: ({ row }) => (
        <ReasonCell
          studentId={row.original.studentId}
          initialReason={row.original.absenceReason || ""}
          onReasonChange={onReasonChange}
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">إلغاء</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onResetStudent(student.studentId)}
              title="إلغاء التحضير وإعادة الطالب للمتبقين"
              className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
