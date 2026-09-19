export interface ParentAttendanceAbsence {
  date: string;
  status: "ABSENT" | "LATE" | "EXCUSED";
  reason?: string | null;
  groupName?: string;
}

export interface ParentAttendanceSummary {
  attendanceRate: number;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  recentAbsences: ParentAttendanceAbsence[];
}

export interface ParentEnrolledGroup {
  id: string;
  groupName: string;
  subjectName: string;
  teacherName: string;
  schedules?: { day: string; time: string }[] | string;
  monthlyFee?: number;
}

export interface ParentTuitionRecord {
  month: string;
  groupName: string;
  subjectName?: string;
  amount: number;
  isPaid: boolean;
  paidAt?: string | null;
  receiptNumber?: string | null;
}

export interface ParentReportData {
  student: {
    id: string;
    fullName: string;
    gradeName: string;
    centerName: string;
    centerPhone?: string;
    parentPhone?: string;
  };
  recentAttendance: ParentAttendanceSummary;
  groups: ParentEnrolledGroup[];
  tuition: ParentTuitionRecord[];
  expiresAt?: string;
}
