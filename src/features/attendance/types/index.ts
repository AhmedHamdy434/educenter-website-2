export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

export interface AttendanceSession {
  id: string;
  groupId: string;
  centerId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    records: number;
  };
}

export interface SessionStudent {
  studentId: string;
  fullName: string;
  phone: string;
  avatar?: string | null;
  status: AttendanceStatus | null;
  absenceReason?: string | null;
}

export interface AttendanceSessionDetails {
  session: AttendanceSession;
  students: SessionStudent[];
}

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
  absenceReason?: string;
}

export interface SaveAttendanceDTO {
  records: AttendanceRecordInput[];
}

export interface GroupAttendanceReport {
  totalSessions: number;
  totalStudents: number;
  attendanceRate: number;
  highestAbsence: {
    studentId: string;
    fullName: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
    totalRecorded: number;
  }[];
  perfectAttendance: {
    studentId: string;
    fullName: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
    totalRecorded: number;
  }[];
}

export interface StudentAttendanceHistoryItem {
  sessionId: string;
  date: string;
  groupName: string;
  status: AttendanceStatus;
  absenceReason?: string | null;
}

export interface StudentAttendanceReport {
  student: {
    id: string;
    fullName: string;
  };
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePercentage: number;
  history: StudentAttendanceHistoryItem[];
}
