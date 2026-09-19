import { ApiResponse } from "@/types";
import { SubscriptionPlan } from "../types/subscription-plan";
import { serverApiClient } from "@/lib/api/apiClient";

export async function getSubscriptionPlans(): Promise<
  ApiResponse<SubscriptionPlan[]>
> {
  return serverApiClient<SubscriptionPlan[]>({
    url: "/subscription-plans",
    method: "GET",
  });
}
