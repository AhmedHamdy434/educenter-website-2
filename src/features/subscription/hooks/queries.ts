"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionOverviewAction } from "../actions/subscription-actions";
import { subscriptionKeys } from "../utils/queryKeys";
import { type ApiResponse } from "@/types";
import { type SubscriptionOverviewData } from "../types";

export function useSubscriptionOverviewQuery(
  initialData?: ApiResponse<SubscriptionOverviewData>
) {
  return useQuery({
    queryKey: subscriptionKeys.details(),
    queryFn: async () => getSubscriptionOverviewAction(),
    initialData,
    staleTime: 60 * 1000, // 1 minute
  });
}
