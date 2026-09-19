"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type Student, type CreateStudentDTO, type UpdateStudentDTO, type StudentPayment } from "../types";
import { type ApiResponse, QueryParams } from "@/types";


export async function getStudents(
  params: QueryParams & { gradeId?: string },
): Promise<ApiResponse<Student[]>> {
  return serverApiClient<Student[]>({
    url: "/students",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function createStudentAction(
  data: CreateStudentDTO,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: "/students",
    method: "POST",
    body: data,
  });
}

export async function updateStudentAction(
  id: string,
  data: UpdateStudentDTO,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: `/students/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function toggleStudentStatusAction(
  id: string,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: `/students/${id}/toggle-status`,
    method: "PATCH",
  });
}

export async function getStudentPaymentsAction(
  studentId: string,
): Promise<ApiResponse<StudentPayment[]>> {
  return serverApiClient<StudentPayment[]>({
    url: `/students/${studentId}/payments`,
    method: "GET",
    cache: "no-store",
  });
}

export async function generateParentLinkAction(
  studentId: string
): Promise<ApiResponse<{ token: string; url?: string; expiresAt?: string }>> {
  return serverApiClient<{ token: string; url?: string; expiresAt?: string }>({
    url: `/p/generate/${studentId}`,
    method: "POST",
  });
}

