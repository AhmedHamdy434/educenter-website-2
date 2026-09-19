"use client";

import React from "react";
import { TrendingUp, Calendar, Users, AlertTriangle, Award, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/common/Loading";
import { useGroupAttendanceReportQuery } from "@/features/attendance/hooks/queries";

interface AttendanceReportsTabProps {
  groupId: string;
}

export function AttendanceReportsTab({ groupId }: AttendanceReportsTabProps) {
  const { data: response, isLoading } = useGroupAttendanceReportQuery(groupId);

  const report = response?.data;

  if (isLoading) {
    return <Loading message="جاري تحميل تقارير الحضور..." />;
  }

  if (!report) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border shadow-none">
        <TrendingUp className="size-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="font-bold text-foreground">لا تتوفر إحصائيات للمجموعة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Overview Cards with Distinct Visual Weights & Tinted Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary Rate Card (Tinted Hero with right accent bar) */}
        <Card className="p-6 flex items-center justify-between border border-primary/25 border-r-4 border-r-primary bg-primary/5 rounded-xl shadow-none relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">نسبة الحضور الإجمالية</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">{report.attendanceRate}%</span>
            </div>
          </div>
          <div className="size-13 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center z-10">
            <TrendingUp className="size-6 stroke-[2.25]" />
          </div>
        </Card>

        {/* Sessions Card (Secondary with accent bar) */}
        <Card className="p-4 flex items-center justify-between border border-border border-r-3 border-r-foreground/40 bg-card rounded-xl shadow-none">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">إجمالي الحصص المنشأة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">{report.totalSessions}</span>
              <span className="text-xs text-muted-foreground font-semibold">جلسات</span>
            </div>
          </div>
          <div className="size-10 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center">
            <Calendar className="size-5" />
          </div>
        </Card>

        {/* Students count Card (Secondary with accent bar) */}
        <Card className="p-4 flex items-center justify-between border border-border border-r-3 border-r-foreground/40 bg-card rounded-xl shadow-none">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">عدد الطلاب المقيدين</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">{report.totalStudents}</span>
              <span className="text-xs text-muted-foreground font-semibold">طلاب</span>
            </div>
          </div>
          <div className="size-10 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center">
            <Users className="size-5" />
          </div>
        </Card>
      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Absence list */}
        <Card className="p-6 space-y-4 border border-border bg-card rounded-xl shadow-none">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <div className="size-7 rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="size-4 stroke-2" />
            </div>
            <span>الطلاب الأكثر غياباً (تنبيه المتابعة)</span>
          </h3>

          {report.highestAbsence.length > 0 ? (
            <div className="divide-y divide-border/60">
              {report.highestAbsence.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-foreground">{item.fullName}</span>
                    <span className="text-[10px] text-muted-foreground block font-medium">
                      نسبة المشاركة: {Math.round((item.present / (item.totalRecorded || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="bg-rose-50/80 border border-rose-300/80 px-3 py-1 rounded-full text-xs font-bold text-rose-800">
                    {item.absent} غيابات
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8 font-medium">لا يوجد طلاب متغيبين في المجموعة حالياً.</p>
          )}
        </Card>

        {/* Perfect Attendance list */}
        <Card className="p-6 space-y-4 border border-border bg-card rounded-xl shadow-none">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <div className="size-7 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Award className="size-4 stroke-2" />
            </div>
            <span>طلاب ذوي حضور مثالي (كشف الشرف)</span>
          </h3>

          {report.perfectAttendance.length > 0 ? (
            <div className="divide-y divide-border/60 max-h-60 overflow-y-auto">
              {report.perfectAttendance.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between py-3">
                  <span className="text-sm font-bold text-foreground">{item.fullName}</span>
                  <div className="bg-emerald-50/80 border border-emerald-300/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="size-3.5" />
                    <span>كامل ({item.present} حصص)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8 font-medium">لا يتوفر كشف شرف حضور كامل بعد.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
