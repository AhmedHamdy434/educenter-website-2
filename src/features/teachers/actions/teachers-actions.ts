"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type Teacher, type CreateTeacherDTO, type UpdateTeacherDTO } from "../types";
import { type ApiResponse, QueryParams } from "@/types";

export async function getTeachers(
  params: QueryParams & { subjectId?: string },
): Promise<ApiResponse<Teacher[]>> {
  return serverApiClient<Teacher[]>({
    url: "/teachers",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function createTeacherAction(
  data: CreateTeacherDTO,
): Promise<ApiResponse<Teacher>> {
  return serverApiClient<Teacher>({
    url: "/teachers",
    method: "POST",
    body: data,
  });
}

export async function updateTeacherAction(
  id: string,
  data: UpdateTeacherDTO,
): Promise<ApiResponse<Teacher>> {
  return serverApiClient<Teacher>({
    url: `/teachers/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function toggleTeacherStatusAction(
  id: string,
): Promise<ApiResponse<Teacher>> {
  return serverApiClient<Teacher>({
    url: `/teachers/${id}/toggle-status`,
    method: "PATCH",
  });
}
