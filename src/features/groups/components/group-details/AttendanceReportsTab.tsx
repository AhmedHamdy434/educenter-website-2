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
import { Loading } from "@/components/common/Loading";
import { StatCard } from "@/components/common/StatCard";
import { useGroupAttendanceReportQuery } from "@/features/attendance/hooks/queries";

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
}: StudentListProps<T>) {
  return (
    <Card className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-none">
      <SectionHeader title={title} icon={icon} variant={variant} />

      {items.length > 0 ? (
        <div className="max-h-72 divide-y divide-border/60 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index}>{renderItem(item)}</div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
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
  } = useGroupAttendanceReportQuery(groupId);

  const report = response?.data;

  if (isLoading) {
    return <Loading message="جاري تحميل تقارير الحضور..." />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-border bg-card px-4 py-10 text-center"
      >
        <p className="font-bold text-foreground">تعذر تحميل تقارير الحضور</p>
        <p className="mt-2 text-sm text-muted-foreground">
          حاول مرة أخرى بعد قليل.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center">
        <TrendingUp className="mx-auto mb-3 size-12 text-muted-foreground/30" />
        <p className="font-bold text-foreground">لا تتوفر إحصائيات للمجموعة</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 text-right">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="نسبة الحضور الإجمالية"
          value={report.attendanceRate}
          unit="%"
          icon={TrendingUp}
          variant="primary"
        />

        <StatCard
          label="إجمالي الحصص المنشأة"
          value={report.totalSessions}
          unit="حصة"
          icon={Calendar}
        />

        <StatCard
          label="عدد الطلاب المقيدين"
          value={report.totalStudents}
          unit="طالب"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentList<StudentAbsenceItem>
          title="الطلاب الأكثر غيابًا"
          icon={AlertTriangle}
          variant="danger"
          items={report.highestAbsence}
          emptyMessage="لا يوجد طلاب لديهم حالات غياب مسجلة."
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3 py-3">
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
            </div>
          )}
        />

        <StudentList<PerfectAttendanceItem>
          title="الطلاب ذوو الحضور المثالي"
          icon={Award}
          variant="success"
          items={report.perfectAttendance}
          emptyMessage="لا يوجد طلاب بحضور مثالي حتى الآن."
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="truncate text-sm font-bold text-foreground">
                {item.fullName}
              </span>

              <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle className="size-3.5" />
                {item.present} حصص
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
