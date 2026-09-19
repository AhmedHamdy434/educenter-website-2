"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { TableSearch } from "@/components/common/TableSearch";
import { SharedTable } from "@/components/common/SharedTable";
import { Loading } from "@/components/common/Loading";
import { type ApiResponse } from "@/types";
import { type StudentAttendanceReport } from "../types";
import { useStudentAttendanceReportQuery } from "../hooks/queries";
import { getStudentAttendanceColumns } from "./columns";

interface StudentAttendanceHistoryClientProps {
  initialData: ApiResponse<StudentAttendanceReport>;
  studentId: string;
}

export function StudentAttendanceHistoryClient({
  initialData,
  studentId,
}: StudentAttendanceHistoryClientProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  // Fetch student report with TanStack Query
  const { data: response, isLoading } = useStudentAttendanceReportQuery(
    studentId,
    true
  );

  const reportData = response?.data || initialData.data;

  // Filter history locally by search query (group name or date)
  const filteredHistory = useMemo(() => {
    const list = reportData?.history || [];
    return list.filter((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return (
        item.groupName.toLowerCase().includes(search.toLowerCase()) ||
        formattedDate.includes(search)
      );
    });
  }, [reportData, search]);

  const percentageColor = useMemo(() => {
    const rate = reportData?.attendancePercentage || 0;
    if (rate >= 90) return "text-emerald-800";
    if (rate >= 75) return "text-amber-800";
    return "text-rose-800";
  }, [reportData]);

  // Define columns for SharedTable
  const columns = useMemo(() => getStudentAttendanceColumns(), []);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header with Focused Title Icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarCheck className="size-5.5 stroke-[2.25]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              سجل الحضور والغياب
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              مرحباً بك {reportData?.student.fullName || "طالبنا العزيز"}، يمكنك هنا متابعة تفاصيل حضورك وغيابك في الحصص المختلفة.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80">
          <TableSearch placeholder="ابحث باسم المجموعة أو التاريخ..." />
        </div>
      </div>

      {isLoading && !reportData ? (
        <Loading message="جاري تحميل سجل الحضور..." />
      ) : (
        <>
          {/* Differentiated Stats Grid Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 1. Primary Tinted Hero Card: Attendance Rate (Hero 2-col with distinct right accent bar) */}
            <div className="sm:col-span-2 lg:col-span-2 rounded-2xl bg-primary/5 border border-primary/25 border-r-4 border-r-primary p-6 flex items-center justify-between shadow-none relative overflow-hidden">
              <div className="space-y-1.5 z-10">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  نسبة الالتزام بالحضور
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black tracking-tight ${percentageColor}`}>
                    {reportData?.attendancePercentage || 0}%
                  </span>
                  <span className="text-xs text-muted-foreground font-bold">
                    {reportData && reportData.attendancePercentage >= 85 ? "مستوى ممتاز" : "يحتاج متابعة"}
                  </span>
                </div>
              </div>
              <div className="size-13 rounded-xl bg-primary/10 flex items-center justify-center text-primary z-10 border border-primary/20">
                <CalendarCheck className="size-7 stroke-[2.25]" />
              </div>
            </div>

            {/* 2. Total Sessions (1-col with neutral right accent) */}
            <div className="lg:col-span-1 rounded-xl bg-card border border-border border-r-3 border-r-foreground/40 p-4 flex flex-col justify-between shadow-none">
              <span className="text-xs text-muted-foreground font-bold">إجمالي الحصص</span>
              <div className="mt-2">
                <span className="text-2xl font-black text-foreground">
                  {reportData?.totalSessions || 0}
                </span>
                <span className="text-xs text-muted-foreground mr-1 font-medium">حصة</span>
              </div>
            </div>

            {/* 3. Attended Days (1-col with emerald right accent) */}
            <div className="lg:col-span-1 rounded-xl bg-card border border-border border-r-3 border-r-emerald-600 p-4 flex flex-col justify-between shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">أيام الحضور</span>
                <CheckCircle className="size-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-emerald-800">
                  {reportData?.present || 0}
                </span>
                <span className="text-xs text-muted-foreground mr-1 font-medium">حصة</span>
              </div>
            </div>

            {/* 4. Absent Days (1-col with rose right accent) */}
            <div className="lg:col-span-1 rounded-xl bg-card border border-border border-r-3 border-r-rose-600 p-4 flex flex-col justify-between shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-800 font-bold">أيام الغياب</span>
                <XCircle className="size-4 text-rose-600" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-rose-800">
                  {reportData?.absent || 0}
                </span>
                <span className="text-xs text-muted-foreground mr-1 font-medium">حصة</span>
              </div>
            </div>

            {/* 5. Late & Excused (1-col with amber right accent) */}
            <div className="lg:col-span-1 rounded-xl bg-card border border-border border-r-3 border-r-amber-600 p-4 flex flex-col justify-between shadow-none">
              <span className="text-xs text-muted-foreground font-bold">تأخير / استئذان</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-amber-800 flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {reportData?.late || 0}
                </span>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-lg font-bold text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  {reportData?.excused || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Logs Log/History Table */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <div className="size-7 rounded-md bg-secondary text-primary flex items-center justify-center">
                <Calendar className="size-4 stroke-2" />
              </div>
              <span>سجل الحصص التفصيلي ({filteredHistory.length})</span>
            </h2>

            <SharedTable
              columns={columns}
              data={filteredHistory}
              isLoading={isLoading}
              emptyMessage="لا يوجد سجل حضور مسجل حتى الآن."
            />
          </div>
        </>
      )}
    </div>
  );
}
