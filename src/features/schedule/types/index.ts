
export type ScheduleViewMode = 'calendar' | 'accordion';

export type AttendanceSessionStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type AttendanceStatusFilter = AttendanceSessionStatus | "ALL";

export type DayOfWeekName =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface ScheduleItemSubject {
  id: string;
  name: string;
}

export interface ScheduleItemGrade {
  id: string;
  name: string;
}

export interface ScheduleItemTeacher {
  id: string;
  fullName: string;
  avatar: string | null;
}

export interface ScheduleSessionItem {
  id: string;
  groupId: string;
  groupName: string;
  subject: ScheduleItemSubject;
  grade: ScheduleItemGrade;
  teacher: ScheduleItemTeacher;
  date: string; // YYYY-MM-DD
  dayOfWeek: DayOfWeekName;
  hour: number;
  minute: number;
  sessionId: string | null;
  attendanceStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  studentsCount: number;
  recordedCount: number;
  isExtraSession: boolean;
  isGroupInactive: boolean;
}

export interface CalendarScheduleData {
  month: string; // YYYY-MM
  range: {
    from: string;
    to: string;
  };
  sessions: ScheduleSessionItem[];
}

export interface UpcomingScheduleData {
  range: {
    from: string;
    to: string;
  };
  sessions: ScheduleSessionItem[];
}

export interface CalendarScheduleQueryParams {
  month: string; // YYYY-MM
  teacherId?: string;
  gradeId?: string;
  subjectId?: string;
  groupId?: string;
}

export interface UpcomingScheduleQueryParams {
  teacherId?: string;
  gradeId?: string;
  subjectId?: string;
  groupId?: string;
}

export interface ScheduleFilterState {
  teacherId?: string;
  gradeId?: string;
  subjectId?: string;
  groupId?: string;
  status: AttendanceStatusFilter;
}
