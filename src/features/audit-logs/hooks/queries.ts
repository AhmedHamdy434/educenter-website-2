"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../actions/audit-logs-actions";
import { type AuditLog, type AuditLogFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export const AUDIT_LOGS_QUERY_KEY = ["audit-logs"];

export function useAuditLogsQuery(
  params: AuditLogFilterParams,
  initialData?: ApiResponse<AuditLog[]>
) {
  return useQuery<ApiResponse<AuditLog[]>>({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, params],
    queryFn: () => getAuditLogs(params),
    initialData,
  });
}
