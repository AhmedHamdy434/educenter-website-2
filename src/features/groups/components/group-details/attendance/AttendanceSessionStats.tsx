
"use client";

import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/common/StatCard";

interface AttendanceSessionStatsProps {
  sessionDate?: string;
  totalStudents: number;
  presentCount: number;
  unrecordedCount: number;
  absentCount: number;
  excusedCount: number;
  attendedAnotherGroupCount?: number;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onSaveAll: () => void;
}

function formatSessionDate(sessionDate?: string) {
  if (!sessionDate) return "تاريخ اليوم";

  return new Date(sessionDate).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AttendanceSessionStats({
  sessionDate,
  totalStudents,
  presentCount,
  unrecordedCount,
  absentCount,
  excusedCount,
  attendedAnotherGroupCount = 0,
  isSaving,
  hasUnsavedChanges,
  onBack,
  onSaveAll,
}: AttendanceSessionStatsProps) {
  const attendancePercentage =
    totalStudents > 0
      ? Math.min(Math.round((presentCount / totalStudents) * 100), 100)
      : 0;

  const formattedDate = formatSessionDate(sessionDate);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">
            تسجيل حضور وغياب الحصة
          </h2>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5 shrink-0 text-primary" />
            <span>{formattedDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <Button
              onClick={onSaveAll}
              disabled={isSaving}
              variant="brand"
              size="sm"
              className="h-9 cursor-pointer gap-2 rounded-lg px-4 font-bold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>حفظ كشف الحضور</span>
                </>
              )}
            </Button>
          ) : (
            <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:flex">
              <CheckCircle2 className="size-3.5 text-emerald-700" />
              <span>جميع التغييرات محفوظة</span>
            </div>
          )}

          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer gap-2 rounded-lg border-border px-4 font-medium text-foreground hover:bg-muted"
          >
            <ArrowRight className="size-4" />
            <span>رجوع للسجل</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="col-span-2 flex flex-col justify-between gap-2.5 rounded-xl border border-border bg-card p-3.5 shadow-none sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              نسبة التحضير
            </span>
            <span className="font-mono text-sm font-extrabold text-primary">
              {attendancePercentage}%
            </span>
          </div>

          <Progress
            value={attendancePercentage}
            max={100}
            className="h-2 bg-secondary"
            indicatorClassName="bg-primary"
          />

          <p className="text-[11px] font-medium text-muted-foreground">
            {presentCount} من أصل {totalStudents} طالب
          </p>
        </Card>
        <StatCard
          label="الحاضرون"
          value={presentCount}
          icon={UserCheck}
        />

        <StatCard
          label="بمجموعة أخرى"
          value={attendedAnotherGroupCount}
          icon={ArrowRightLeft}
        />

        <StatCard
          label="لم يُسجل بعد"
          value={unrecordedCount}
          icon={Clock}
        />

        <StatCard
          label="غياب / استئذان"
          value={
            excusedCount > 0 ? (
              <span className="flex items-baseline gap-1.5">
                <span>{absentCount}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  ({excusedCount} مستأذن)
                </span>
              </span>
            ) : (
              absentCount
            )
          }
          icon={AlertCircle}
        />
      </div>
    </div>
  );
}
