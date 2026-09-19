"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type Subject, type CreateSubjectDTO, type UpdateSubjectDTO } from "../types";
import { type ApiResponse, QueryParams } from "@/types";

export async function getSubjects(
  params: QueryParams & { gradeId?: string },
): Promise<ApiResponse<Subject[]>> {
  return serverApiClient<Subject[]>({
    url: "/subjects",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function createSubjectAction(
  data: CreateSubjectDTO,
): Promise<ApiResponse<Subject>> {
  return serverApiClient<Subject>({
    url: "/subjects",
    method: "POST",
    body: data,
  });
}

export async function updateSubjectAction(
  id: string,
  data: UpdateSubjectDTO,
): Promise<ApiResponse<Subject>> {
  return serverApiClient<Subject>({
    url: `/subjects/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function toggleSubjectStatusAction(
  id: string,
): Promise<ApiResponse<Subject>> {
  return serverApiClient<Subject>({
    url: `/subjects/${id}/toggle-status`,
    method: "PATCH",
  });
}

export async function getSubjectsOptions(
  gradeId?: string,
): Promise<ApiResponse<{ id: string; name: string; grade: { name: string } }[]>> {
  return serverApiClient<{ id: string; name: string; grade: { name: string } }[]>({
    url: "/subjects/options",
    method: "GET",
    params: gradeId ? { gradeId } : undefined,
    cache: "no-store",
  });
}
