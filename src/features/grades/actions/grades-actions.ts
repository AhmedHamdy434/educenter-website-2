"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type Grade, type CreateGradeDTO, type UpdateGradeDTO } from "../types";
import { type ApiResponse, QueryParams } from "@/types";

export async function getGrades(
  params: QueryParams,
): Promise<ApiResponse<Grade[]>> {
  return serverApiClient<Grade[]>({
    url: "/grades",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function getGradeById(id: string): Promise<ApiResponse<Grade>> {
  return serverApiClient<Grade>({
    url: `/grades/${id}`,
    method: "GET",
    cache: "no-store",
  });
}

export async function createGradeAction(
  data: CreateGradeDTO,
): Promise<ApiResponse<Grade>> {
  console.log("dataaaaaaa", data);
  return serverApiClient<Grade>({
    url: "/grades",
    method: "POST",
    body: data,
  });
}

export async function updateGradeAction(
  id: string,
  data: UpdateGradeDTO,
): Promise<ApiResponse<Grade>> {
  return serverApiClient<Grade>({
    url: `/grades/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function toggleGradeStatusAction(
  id: string,
): Promise<ApiResponse<Grade>> {
  return serverApiClient<Grade>({
    url: `/grades/${id}/toggle-status`,
    method: "PATCH",
  });
}
