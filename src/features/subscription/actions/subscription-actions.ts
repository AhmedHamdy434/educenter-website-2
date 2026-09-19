"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import { type SubscriptionOverviewData } from "../types";


export async function getSubscriptionOverviewAction(): Promise<
  ApiResponse<SubscriptionOverviewData>
> {
  return serverApiClient<SubscriptionOverviewData>({
    url: "/centers/my-subscription",
    method: "GET",
  });
}
