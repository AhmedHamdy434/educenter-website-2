'use server';

import { serverApiClient } from '@/lib/api/apiClient';
import { ApiResponse } from '@/types';
import { type AttendanceSession } from '@/features/attendance/types';
import {
  ExtraSessionItem,
  ExtraSessionDetails,
  CreateExtraSessionDTO,
  UpdateExtraSessionDTO,
  CancelExtraSessionDTO,
  AddExtraSessionStudentsDTO,
  PayExtraSessionStudentDTO,
  WaiveExtraSessionStudentDTO,
  ExtraSessionsQueryParams,
} from '../types';

export async function getGroupExtraSessions(
  groupId: string,
  params?: ExtraSessionsQueryParams,
): Promise<ApiResponse<ExtraSessionItem[]>> {
  return serverApiClient<ExtraSessionItem[]>({
    url: `/groups/${groupId}/extra-sessions`,
    method: 'GET',
    params: params,
    cache: 'no-store',
  });
}

export async function getExtraSessionDetails(
  id: string,
): Promise<ApiResponse<ExtraSessionDetails>> {
  return serverApiClient<ExtraSessionDetails>({
    url: `/extra-sessions/${id}`,
    method: 'GET',
    cache: 'no-store',
  });
}

export async function createExtraSessionAction(
  groupId: string,
  data: CreateExtraSessionDTO,
): Promise<ApiResponse<ExtraSessionDetails>> {
  return serverApiClient<ExtraSessionDetails>({
    url: `/groups/${groupId}/extra-sessions`,
    method: 'POST',
    body: data,
  });
}

export async function updateExtraSessionAction(
  id: string,
  data: UpdateExtraSessionDTO,
): Promise<ApiResponse<ExtraSessionDetails>> {
  return serverApiClient<ExtraSessionDetails>({
    url: `/extra-sessions/${id}`,
    method: 'PATCH',
    body: data,
  });
}

export async function cancelExtraSessionAction(
  id: string,
  data: CancelExtraSessionDTO,
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return serverApiClient<{ success: boolean; message: string }>({
    url: `/extra-sessions/${id}/cancel`,
    method: 'PATCH',
    body: data,
  });
}

export async function addExtraSessionStudentsAction(
  id: string,
  data: AddExtraSessionStudentsDTO,
): Promise<ApiResponse<{ addedCount: number }>> {
  return serverApiClient<{ addedCount: number }>({
    url: `/extra-sessions/${id}/students`,
    method: 'POST',
    body: data,
  });
}

export async function payExtraSessionStudentAction(
  id: string,
  studentId: string,
  data: PayExtraSessionStudentDTO,
): Promise<ApiResponse<{ studentId: string; paid: number; paidAt: string }>> {
  return serverApiClient<{ studentId: string; paid: number; paidAt: string }>({
    url: `/extra-sessions/${id}/students/${studentId}/pay`,
    method: 'POST',
    body: data,
  });
}

export async function waiveExtraSessionStudentAction(
  id: string,
  studentId: string,
  data: WaiveExtraSessionStudentDTO,
): Promise<ApiResponse<{ studentId: string; isWaived: boolean }>> {
  return serverApiClient<{ studentId: string; isWaived: boolean }>({
    url: `/extra-sessions/${id}/students/${studentId}/waive`,
    method: 'PATCH',
    body: data,
  });
}

export async function startExtraSessionAttendanceAction(
  id: string,
): Promise<ApiResponse<AttendanceSession>> {
  return serverApiClient<AttendanceSession>({
    url: `/extra-sessions/${id}/session`,
    method: 'POST',
  });
}


