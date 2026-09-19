"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ParentReportData } from "../types";
import { type ApiResponse } from "@/types";

export async function getParentReport(
  token: string
): Promise<ApiResponse<ParentReportData>> {
  return serverApiClient<ParentReportData>({
    url: `/p/${token}`,
    method: "GET",
    cache: "no-store",
  });
}
