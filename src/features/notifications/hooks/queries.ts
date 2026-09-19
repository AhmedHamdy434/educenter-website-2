"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../actions/notifications-actions";
import { type NotificationLog, type NotificationFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications-log"];

export function useNotificationsQuery(
  params: NotificationFilterParams,
  initialData?: ApiResponse<NotificationLog[]>
) {
  return useQuery<ApiResponse<NotificationLog[]>>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
    initialData,
  });
}
