"use client";

import { type ParentReportData } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  User,
  Phone,
  ShieldCheck,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ParentReportViewProps {
  data: ParentReportData;
}

export function ParentReportView({ data }: ParentReportViewProps) {
  const { student,recentAttendance: attendance, groups, tuition } = data;
  console.log(data,"fdadad");

  const attendanceRate = attendance?.attendanceRate ?? 0;
  const isExcellent = attendanceRate >= 85;
  const isWarning = attendanceRate < 70;

  return (
    <div
      className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-sans"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 1. Brand & Header Card */}
        <header className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3.5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary font-bold border border-border">
                <GraduationCap className="size-8 stroke-[2.25]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    {student.fullName}
                  </h1>
                  <Badge
                    variant="outline"
                    className="bg-secondary text-primary border-border font-bold text-xs"
                  >
                    {student.gradeName}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Building className="size-3.5 text-primary" />
                  <span>المركز التعليمي: {student.centerName}</span>
                </p>
              </div>
            </div>

            {/* Token Badge */}
            <div className="flex sm:flex-col items-center sm:items-end gap-1.5 bg-secondary/50 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                <ShieldCheck className="size-4 text-emerald-700" />
                <span>تقرير رسمي موثق</span>
              </div>
              {student.centerPhone && (
                <span
                  className="text-[11px] text-muted-foreground font-mono flex items-center gap-1"
                  dir="ltr"
                >
                  <Phone className="size-3" />
                  {student.centerPhone}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>تقرير متابعة أداء الطالب وغيابه ومدفوعاته الشهرية</span>
            <span className="text-amber-800 font-medium flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>التقرير متاح ومحدث دورياً عبر هذا الرابط</span>
            </span>
          </div>
        </header>

        {/* 2. Attendance Stats Section */}
        <section aria-labelledby="attendance-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            <h2
              id="attendance-heading"
              className="text-lg font-bold text-foreground"
            >
              مؤشرات الحضور والغياب
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Primary Hero Gauge Card */}
            <Card
              className={`p-5 rounded-xl border sm:col-span-2 flex flex-col justify-between shadow-xs ${
                isWarning
                  ? "bg-rose-50/60 border-rose-200"
                  : isExcellent
                    ? "bg-emerald-50/60 border-emerald-200"
                    : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground/80">
                  نسبة الحضور العامة
                </span>
                <Badge
                  variant="outline"
                  className={`font-bold text-xs ${
                    isWarning
                      ? "bg-rose-100 text-rose-900 border-rose-300"
                      : isExcellent
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                  }`}
                >
                  {isExcellent ? "ممتاز" : isWarning ? "يحتاج لمتابعة" : "جيد"}
                </Badge>
              </div>

              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-foreground">
                  {attendanceRate}%
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  من إجمالي {attendance.totalSessions} حصة مسجلة
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWarning
                      ? "bg-rose-600"
                      : isExcellent
                        ? "bg-emerald-700"
                        : "bg-amber-600"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, attendanceRate))}%`,
                  }}
                />
              </div>
            </Card>

            {/* Secondary Metric Cards */}
            <Card className="p-4 rounded-xl border border-border bg-card shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>مرات الحضور</span>
                <CheckCircle2 className="size-4 text-emerald-700" />
              </div>
              <span className="text-2xl font-black font-mono text-emerald-800 mt-3">
                {attendance.presentCount}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                حصة في الموعد
              </span>
            </Card>

            <Card className="p-4 rounded-xl border border-border bg-card shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>مرات الغياب</span>
                <XCircle className="size-4 text-rose-700" />
              </div>
              <span className="text-2xl font-black font-mono text-rose-800 mt-3">
                {attendance.absentCount}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                غياب غير مسجل بعذر
              </span>
            </Card>
          </div>

          {/* Recent Absences List if any */}
          {attendance.recentAbsences &&
            attendance.recentAbsences.length > 0 && (
              <Card className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-none">
                <h3 className="text-xs font-bold text-foreground">
                  سجل أيام الغياب والتأخير الأخيرة:
                </h3>
                <div className="divide-y divide-border/60">
                  {attendance.recentAbsences.map((rec, i) => (
                    <div
                      key={i}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            rec.status === "ABSENT"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : rec.status === "LATE"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-stone-100 text-stone-700 border-stone-200"
                          }
                        >
                          {rec.status === "ABSENT"
                            ? "غائب"
                            : rec.status === "LATE"
                              ? "متأخر"
                              : "مستأذن"}
                        </Badge>
                        <span className="font-semibold text-foreground font-mono">
                          {new Date(rec.date).toLocaleDateString("ar-EG", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {rec.groupName && (
                          <span className="text-muted-foreground">
                            ({rec.groupName})
                          </span>
                        )}
                      </div>
                      {rec.reason && (
                        <span className="text-muted-foreground text-xs bg-muted/40 px-2.5 py-1 rounded">
                          السبب: {rec.reason}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
        </section>

        {/* 3. Enrolled Groups & Subjects */}
        <section aria-labelledby="groups-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <h2
              id="groups-heading"
              className="text-lg font-bold text-foreground"
            >
              المجموعات والمواد المسجل بها
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <Card
                  key={group.id}
                  className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-none hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {group.groupName}
                      </h3>
                      <span className="text-xs font-semibold text-primary">
                        {group.subjectName}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-secondary text-primary border-border text-[11px] font-bold"
                    >
                      نشط
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/60">
                    <User className="size-3.5 text-primary" />
                    <span>المعلم: {group.teacherName}</span>
                  </div>

                  {group.schedules && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-accent" />
                      <span className="font-mono text-[11px]">
                        {typeof group.schedules === "string"
                          ? group.schedules
                          : Array.isArray(group.schedules)
                            ? group.schedules
                                .map((s) => `${s.day} ${s.time}`)
                                .join(" • ")
                            : "—"}
                      </span>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground sm:col-span-2 border border-border bg-card rounded-xl">
                لا توجد مجموعات مسجلة حالياً.
              </Card>
            )}
          </div>
        </section>

        {/* 4. Tuition Fees Status */}
        <section aria-labelledby="tuition-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            <h2
              id="tuition-heading"
              className="text-lg font-bold text-foreground"
            >
              سجل الاشتراكات والمدفوعات الشهرية
            </h2>
          </div>

          <Card className="rounded-xl border border-border bg-card overflow-hidden shadow-none">
            {tuition && tuition.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-secondary/60 text-foreground font-bold border-b border-border">
                    <tr>
                      <th className="p-3.5">الشهر الدراسي</th>
                      <th className="p-3.5">المجموعة / المادة</th>
                      <th className="p-3.5">قيمة الاشتراك</th>
                      <th className="p-3.5">حالة السداد</th>
                      <th className="p-3.5">تاريخ الدفع والإيصال</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {tuition.map((t, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-3.5 font-bold text-foreground">
                          {t.month}
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          {t.groupName}{" "}
                          {t.subjectName ? `(${t.subjectName})` : ""}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-foreground">
                          {t.amount} ج.م
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant="outline"
                            className={
                              t.isPaid
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold"
                                : "bg-rose-50 text-rose-800 border-rose-200 font-bold"
                            }
                          >
                            {t.isPaid ? "تم السداد" : "مستحق وغير مدفوع"}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                          {t.paidAt
                            ? `${new Date(t.paidAt).toLocaleDateString("ar-EG")}${
                                t.receiptNumber
                                  ? ` (إيصال #${t.receiptNumber})`
                                  : ""
                              }`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-xs">
                لا توجد سجلات دفع مسجلة للطالب حتى الآن.
              </div>
            )}
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>
            © {new Date().getFullYear()} {student.centerName} — مدعوم بمنصة
            EduCenter التعليمية
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            هذا الرابط مخصص لولي الأمر فقط، نرجو عدم مشاركته مع غير المعنيين.
          </p>
        </footer>
      </div>
    </div>
  );
}
