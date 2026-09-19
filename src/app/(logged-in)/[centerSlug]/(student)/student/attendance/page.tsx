import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { getStudentReportAction } from "@/features/attendance/actions/attendance-actions";
import { StudentAttendanceHistoryClient } from "@/features/attendance/components/StudentAttendanceHistoryClient";

export const metadata: Metadata = {
  title: "سجل الحضور والغياب | الطالب",
  description: "عرض وتتبع سجل حضورك وغيابك في الحصص المختلفة.",
};

export default async function StudentAttendancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const initialReport = await getStudentReportAction("me");

  return (
    <StudentAttendanceHistoryClient
      initialData={initialReport}
      studentId="me"
    />
  );
}
