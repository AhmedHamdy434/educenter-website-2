import { useQuery } from "@tanstack/react-query";
import {
  getGroupSessionsAction,
  getSessionDetailsAction,
  getGroupReportAction,
  getStudentReportAction,
} from "../actions/attendance-actions";

export const attendanceKeys = {
  all: ["attendance"] as const,
  groupSessions: (groupId: string) => ["attendance", "sessions", groupId] as const,
  sessionDetails: (groupId: string, sessionId: string) => ["attendance", "session", groupId, sessionId] as const,
  groupReport: (groupId: string) => ["attendance", "report", "group", groupId] as const,
  studentReport: (studentId: string) => ["attendance", "report", "student", studentId] as const,
};

export function useGroupAttendanceSessionsQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: attendanceKeys.groupSessions(groupId),
    queryFn: () => getGroupSessionsAction(groupId),
    enabled: enabled && !!groupId,
  });
}

export function useAttendanceSessionDetailsQuery(groupId: string, sessionId: string, enabled = true) {
  return useQuery({
    queryKey: attendanceKeys.sessionDetails(groupId, sessionId),
    queryFn: () => getSessionDetailsAction(groupId, sessionId),
    enabled: enabled && !!groupId && !!sessionId,
  });
}

export function useGroupAttendanceReportQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: attendanceKeys.groupReport(groupId),
    queryFn: () => getGroupReportAction(groupId),
    enabled: enabled && !!groupId,
  });
}

export function useStudentAttendanceReportQuery(studentId: string, enabled = true) {
  return useQuery({
    queryKey: attendanceKeys.studentReport(studentId),
    queryFn: () => getStudentReportAction(studentId),
    enabled: enabled && !!studentId,
  });
}
