"use client";

import React from "react";
import {
  Clock,
  UserCheck,
  Sparkles,
  Loader2,
  ArrowRightLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionStudent, AttendanceStatus } from "@/features/attendance/types";

interface AttendancePendingListProps {
  students: SessionStudent[];
  isProcessingId: string | null;
  onQuickPresent: (student: SessionStudent) => void;
  onQuickStatusChange: (student: SessionStudent, status: AttendanceStatus) => void;
}

export function AttendancePendingList({
  students,
  isProcessingId,
  onQuickPresent,
  onQuickStatusChange,
}: AttendancePendingListProps) {
  return (
    <div className="space-y-3">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="size-4.5 text-muted-foreground" />
          <span>لم يتم تسجيل حضورهم بعد</span>
          <Badge
            variant="subtle"
            className="font-mono text-xs font-bold text-muted-foreground"
          >
            {students.length}
          </Badge>
        </h3>
        {students.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            يمكنك تسجيل الحضور بنقرة واحدة
          </span>
        )}
      </div>

      {students.length > 0 ? (
        <div className="space-y-2">
          {students.map((student) => {
            const isProcessing = isProcessingId === student.studentId;

            return (
              <Card
                key={student.studentId}
                className="p-3 sm:px-5 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border/70 bg-secondary/20 hover:border-border transition-colors shadow-none rounded-xl"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div className="size-8.5 rounded-full bg-secondary text-muted-foreground border border-border flex items-center justify-center font-bold text-xs shrink-0">
                    {student.fullName.substring(0, 2)}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-foreground text-xs sm:text-sm">
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
                    </div>
                  </div>
                </div>

                {/* Actions: Quick Present and Other status options */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Quick status mini buttons */}
                  <div className="hidden md:flex items-center gap-1 border-l border-border pl-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        onQuickStatusChange(
                          student,
                          AttendanceStatus.ATTENDED_ANOTHER_GROUP
                        )
                      }
                      title="حضر بمجموعة أخرى"
                      className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowRightLeft className="size-3" />
                      <span>مجموعة أخرى</span>
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        onQuickStatusChange(student, AttendanceStatus.LATE)
                      }
                      title="تسجيل متأخر"
                      className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 rounded-md transition-colors cursor-pointer"
                    >
                      متأخر
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        onQuickStatusChange(student, AttendanceStatus.EXCUSED)
                      }
                      title="تسجيل استئذان"
                      className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
                    >
                      مستأذن
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        onQuickStatusChange(student, AttendanceStatus.ABSENT)
                      }
                      title="تسجيل غياب"
                      className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 rounded-md transition-colors cursor-pointer"
                    >
                      غائب
                    </button>
                  </div>

                  {/* Primary Quick Present Button */}
                  <Button
                    type="button"
                    onClick={() => onQuickPresent(student)}
                    disabled={isProcessing}
                    size="sm"
                    variant="brand"
                    className="h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-none"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="size-3.5" />
                    )}
                    <span>تسجيل حضور</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-4 border border-dashed border-emerald-300 rounded-xl bg-emerald-50/30">
          <Sparkles className="size-8 mx-auto text-emerald-600 mb-2" />
          <p className="text-sm font-bold text-emerald-900">
            اكتمل تسجيل حضور جميع الطلاب في هذه الحصة!
          </p>
          <p className="text-xs text-emerald-800/80 mt-1">
            تم تسجيل حالات جميع الطلاب المسجلين في المجموعة بنجاح.
          </p>
        </div>
      )}
    </div>
  );
}
