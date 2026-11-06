"use client";

import {
  TrendingUp,
  Calendar,
  Users,
  AlertTriangle,
  Award,
  CheckCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useGroupAttendanceReportQuery } from "@/features/attendance/hooks/queries";
import { StudentListCardSkeleton } from "./AttendanceReportsSkeleton";

interface AttendanceReportsTabProps {
  groupId: string;
}

interface StudentAbsenceItem {
  studentId: string;
  fullName: string;
  absent: number;
  present: number;
  totalRecorded: number;
}

interface PerfectAttendanceItem {
  studentId: string;
  fullName: string;
  present: number;
}

interface StudentListProps<T> {
  title: string;
  icon: typeof AlertTriangle;
  variant: "danger" | "success";
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  isLoading: boolean;
}

function SectionHeader({
  title,
  icon: Icon,
  variant,
}: {
  title: string;
  icon: typeof AlertTriangle;
  variant: "danger" | "success";
}) {
  const styles = {
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <h3 className="flex items-center gap-2 border-b border-border pb-3 text-sm font-bold text-foreground">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${styles[variant]}`}
      >
        <Icon className="size-4" />
      </span>

      <span>{title}</span>
    </h3>
  );
}

function StudentList<T>({
  title,
  icon,
  variant,
  items,
  emptyMessage,
  renderItem,
  isLoading,
}: StudentListProps<T>) {
  return (
    <Card className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-none">
      {isLoading ? (
        <StudentListCardSkeleton />
      ) : (
        <>
          <SectionHeader title={title} icon={icon} variant={variant} />

          {items.length > 0 ? (
            <div className="max-h-72 divide-y divide-border/60 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function getAttendanceRate(present: number, total: number): number {
  if (total <= 0) return 0;

  return Math.round((present / total) * 100);
}

export function AttendanceReportsTab({ groupId }: AttendanceReportsTabProps) {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupAttendanceReportQuery(groupId);

  const report = response?.data;
  const cards = [
    {
      label: "نسبة الحضور الإجمالية",
      value: report?.attendanceRate,
      unit: "%",
      icon: TrendingUp,
      variant: "primary",
    },
    {
      label: "إجمالي الحصص المنشأة",
      value: report?.totalSessions,
      unit: "حصة",
      icon: Calendar,
    },
    {
      label: "عدد الطلاب المقيدين",
      value: report?.totalStudents,
      unit: "طالب",
      icon: Users,
    },
  ];

  if (isError) {
    return (
      <QueryErrorState
        title="تعذر تحميل تقارير الحضور"
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (!report && !isLoading) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="لا تتوفر إحصائيات للمجموعة"
        description="لم يتم تسجيل حضور كافٍ لتوليد تقارير إحصائية لهذه المجموعة بعد."
      />
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* 1. شبكة البطاقات الإحصائية (StatCards Grid) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, unit, icon, variant }) =>
          isLoading ? (
            <StatCardSkeleton key={label} />
          ) : (
            <StatCard
              key={label}
              label={label}
              value={value}
              unit={unit}
              icon={icon}
              variant={variant === "primary" ? "primary" : "default"}
            />
          ),
        )}
      </div>

      {/* 2. قوائم تميز وغياب الطلاب (Student Lists Grid) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentList<StudentAbsenceItem>
          title="الطلاب الأكثر غيابًا"
          icon={AlertTriangle}
          variant="danger"
          items={report?.highestAbsence || []}
          emptyMessage="لا يوجد طلاب لديهم حالات غياب مسجلة."
          renderItem={(item) => (
            <>
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {item.fullName}
                </p>

                <p className="text-xs text-muted-foreground">
                  نسبة الحضور:{" "}
                  {getAttendanceRate(item.present, item.totalRecorded)}%
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-rose-300/80 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
                {item.absent} غياب
              </span>
            </>
          )}
          isLoading={isLoading}
        />

        <StudentList<PerfectAttendanceItem>
          title="الطلاب ذوو الحضور المثالي"
          icon={Award}
          variant="success"
          items={report?.perfectAttendance || []}
          emptyMessage="لا يوجد طلاب بحضور مثالي حتى الآن."
          renderItem={(item) => (
            <>
              <span className="truncate text-sm font-bold text-foreground">
                {item.fullName}
              </span>

              <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle className="size-3.5" />
                {item.present} حصص
              </span>
            </>
          )}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
