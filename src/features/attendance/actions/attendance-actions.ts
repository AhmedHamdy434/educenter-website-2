"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import {
  type AttendanceSession,
  type AttendanceSessionDetails,
  type SaveAttendanceDTO,
  type GroupAttendanceReport,
  type StudentAttendanceReport,
} from "../types";

export async function startOrGetSessionAction(
  groupId: string
): Promise<ApiResponse<AttendanceSession>> {
  return serverApiClient<AttendanceSession>({
    url: `/groups/${groupId}/attendance/session`,
    method: "POST",
    cache: "no-store",
  });
}

export async function getSessionDetailsAction(
  groupId: string,
  sessionId: string
): Promise<ApiResponse<AttendanceSessionDetails>> {
  return serverApiClient<AttendanceSessionDetails>({
    url: `/groups/${groupId}/attendance/session/${sessionId}`,
    method: "GET",
    cache: "no-store",
  });
}

export async function saveAttendanceAction(
  groupId: string,
  sessionId: string,
  data: SaveAttendanceDTO
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return serverApiClient<{ success: boolean; message: string }>({
    url: `/groups/${groupId}/attendance/session/${sessionId}/save`,
    method: "POST",
    body: data,
  });
}

export async function getGroupSessionsAction(
  groupId: string
): Promise<ApiResponse<AttendanceSession[]>> {
  return serverApiClient<AttendanceSession[]>({
    url: `/groups/${groupId}/attendance/sessions`,
    method: "GET",
    cache: "no-store",
  });
}

export async function getGroupReportAction(
  groupId: string
): Promise<ApiResponse<GroupAttendanceReport>> {
  return serverApiClient<GroupAttendanceReport>({
    url: `/groups/${groupId}/attendance/report`,
    method: "GET",
    cache: "no-store",
  });
}

export async function getStudentReportAction(
  studentId: string
): Promise<ApiResponse<StudentAttendanceReport>> {
  return serverApiClient<StudentAttendanceReport>({
    url: `/students/${studentId}/attendance/report`,
    method: "GET",
    cache: "no-store",
  });
}
