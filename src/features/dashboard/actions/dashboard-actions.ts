"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import { OwnerDashboardData } from "../types";

export interface GetDashboardParams {
  period?: string;
  from?: string;
  to?: string;
}

export async function getOwnerDashboardAction(
  params?: GetDashboardParams,
): Promise<ApiResponse<OwnerDashboardData>> {
  return serverApiClient<OwnerDashboardData>({
    url: "/owner/dashboard",
    method: "GET",
    params: params as Record<string, string | number | undefined>,
    cache: "no-store",
  });
}

