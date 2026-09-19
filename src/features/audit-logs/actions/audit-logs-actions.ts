"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type AuditLog, type AuditLogFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export async function getAuditLogs(
  params: AuditLogFilterParams
): Promise<ApiResponse<AuditLog[]>> {
  return serverApiClient<AuditLog[]>({
    url: "/audit-logs",
    method: "GET",
    params,
    cache: "no-store",
  });
}
