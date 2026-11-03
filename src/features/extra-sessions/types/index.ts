export type ExtraSessionType = 'MAKEUP' | 'REVISION' | 'EXAM_PREP' | 'OTHER';

export type ExtraSessionAudience = 'ALL_GROUP' | 'SELECTED';

export type ExtraSessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED';

export type ExtraSessionAttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EXCUSED'
  | null;

export interface ExtraSessionStudentUser {
  fullName: string;
  phone: string | null;
  avatar: string | null;
}

export interface ExtraSessionStudentProfile {
  id: string;
  code: string;
  parentPhone: string;
  user: ExtraSessionStudentUser;
}

export interface ExtraSessionParticipant {
  id: string;
  extraSessionId: string;
  studentId: string;
  amountDue: number | string;
  isWaived: boolean;
  paid: number | string;
  paidAt: string | null;
  notes: string | null;
  attendanceStatus: ExtraSessionAttendanceStatus;
  absenceReason: string | null;
  student: ExtraSessionStudentProfile;
}

export interface ExtraSessionFinancialSummary {
  totalDue: number;
  totalCollected: number;
  remaining: number;
  totalWaived: number;
  studentsCount: number;
  paidCount: number;
  waivedCount: number;
  unpaidCount: number;
}

export interface ExtraSessionsGroupStats {
  totalSessions: number;
  scheduledSessions: number;
  completedSessions: number;
  canceledSessions: number;
  totalCollected: number;
}

export interface ExtraSessionGroupTeacherUser {
  fullName: string;
  avatar: string | null;
}

export interface ExtraSessionGroupInfo {
  id: string;
  name: string;
  subject: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    user: ExtraSessionGroupTeacherUser;
  };
}

export interface ExtraSessionAttendanceSessionRef {
  id: string;
  _count?: {
    records: number;
  };
}

export interface ExtraSessionItem {
  id: string;
  centerId: string;
  groupId: string;
  title: string | null;
  type: ExtraSessionType;
  audience: ExtraSessionAudience;
  status: ExtraSessionStatus;
  date: string; // YYYY-MM-DD
  hour: number;
  minute: number;
  location: string | null;
  fee: number | string;
  notes: string | null;
  cancellationNotes?: string | null;
  canceledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  group?: ExtraSessionGroupInfo;
  attendanceSession?: ExtraSessionAttendanceSessionRef | null;
  _count?: {
    participants: number;
  };
  financialSummary: ExtraSessionFinancialSummary;
}

export interface ExtraSessionDetails extends ExtraSessionItem {
  participants: ExtraSessionParticipant[];
}

export interface CreateExtraSessionDTO {
  title?: string;
  type?: ExtraSessionType;
  audience?: ExtraSessionAudience;
  date: string; // YYYY-MM-DD
  hour: number;
  minute: number;
  location?: string;
  fee?: number;
  notes?: string;
  studentIds?: string[];
}

export interface UpdateExtraSessionDTO {
  title?: string;
  type?: ExtraSessionType;
  date?: string;
  hour?: number;
  minute?: number;
  location?: string;
  fee?: number;
  notes?: string;
}

export interface CancelExtraSessionDTO {
  reason?: string;
  confirmRefundNotes?: string;
}

export interface AddExtraSessionStudentsDTO {
  studentIds: string[];
}

export interface PayExtraSessionStudentDTO {
  notes?: string;
}

export interface WaiveExtraSessionStudentDTO {
  reason?: string;
}

export interface ExtraSessionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ExtraSessionStatus | 'ALL';
  from?: string;
  to?: string;
}

export const EXTRA_SESSION_TYPE_LABELS: Record<ExtraSessionType, string> = {
  MAKEUP: 'تعويضية',
  REVISION: 'مراجعة',
  EXAM_PREP: 'ليلة امتحان',
  OTHER: 'أخرى',
};

export const EXTRA_SESSION_STATUS_LABELS: Record<ExtraSessionStatus, string> = {
  SCHEDULED: 'مجدولة',
  COMPLETED: 'مكتملة',
  CANCELED: 'ملغاة',
};

