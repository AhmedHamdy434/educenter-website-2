"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type NotificationLog, type NotificationFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export async function getNotifications(
  params: NotificationFilterParams
): Promise<ApiResponse<NotificationLog[]>> {
  return serverApiClient<NotificationLog[]>({
    url: "/notifications",
    method: "GET",
    params,
    cache: "no-store",
  });
}
