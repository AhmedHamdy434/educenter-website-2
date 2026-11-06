"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import {
  TeacherFinancialSummary,
  TeacherFinancialRow,
  UnsettledEarningItem,
  SettlementRecord,
  SettlementDetails,
  CreateSettlementDTO,
  CreateRefundDTO,
} from "../types";

export interface GetTeachersOverviewResponse {
  summary: TeacherFinancialSummary;
  teachers: TeacherFinancialRow[];
}

export async function getTeachersFinancialOverviewAction(
  search?: string,
): Promise<ApiResponse<GetTeachersOverviewResponse>> {
  return serverApiClient<GetTeachersOverviewResponse>({
    url: "/owner/settlements/teachers-overview",
    method: "GET",
    params: search ? { search } : undefined,
    cache: "no-store",
  });
}

export async function getTeacherUnsettledEarningsAction(
  teacherId: string,
): Promise<
  ApiResponse<{
    teacher: { id: string; name: string; phone?: string };
    entries: UnsettledEarningItem[];
  }>
> {
  return serverApiClient<{
    teacher: { id: string; name: string; phone?: string };
    entries: UnsettledEarningItem[];
  }>({
    url: `/owner/settlements/teachers/${teacherId}/unsettled`,
    method: "GET",
    cache: "no-store",
  });
}

export async function createSettlementAction(
  data: CreateSettlementDTO,
): Promise<ApiResponse<SettlementRecord>> {
  return serverApiClient<SettlementRecord>({
    url: "/owner/settlements",
    method: "POST",
    body: data,
  });
}

export interface GetSettlementsParams {
  page?: number;
  limit?: number;
  teacherId?: string;
  status?: string;
  from?: string;
  to?: string;
}

export async function getSettlementsAction(
  params?: GetSettlementsParams,
): Promise<ApiResponse<SettlementRecord[]>> {
  return serverApiClient<SettlementRecord[]>({
    url: "/owner/settlements",
    method: "GET",
    params: params as Record<string, string | number | undefined>,
    cache: "no-store",
  });
}

export async function getSettlementByIdAction(
  id: string,
): Promise<ApiResponse<SettlementDetails>> {
  return serverApiClient<SettlementDetails>({
    url: `/owner/settlements/${id}`,
    method: "GET",
    cache: "no-store",
  });
}

export async function completeSettlementAction(
  id: string,
): Promise<ApiResponse<SettlementRecord>> {
  return serverApiClient<SettlementRecord>({
    url: `/owner/settlements/${id}/complete`,
    method: "PATCH",
  });
}

export async function cancelSettlementAction(
  id: string,
  cancellationReason: string,
): Promise<ApiResponse<SettlementRecord>> {
  return serverApiClient<SettlementRecord>({
    url: `/owner/settlements/${id}/cancel`,
    method: "PATCH",
    body: { cancellationReason },
  });
}

export async function createRefundAction(
  data: CreateRefundDTO,
): Promise<ApiResponse<Record<string, unknown>>> {
  return serverApiClient<Record<string, unknown>>({
    url: "/owner/settlements/refunds",
    method: "POST",
    body: data,
  });
}
