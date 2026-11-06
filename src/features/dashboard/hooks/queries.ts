import { useQuery } from "@tanstack/react-query";
import {
  getOwnerDashboardAction,
  GetDashboardParams,
} from "../actions/dashboard-actions";
import { dashboardKeys } from "../utils/queryKeys";

export function useOwnerDashboardQuery(params?: GetDashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.data(params),
    queryFn: async () => await getOwnerDashboardAction(params),
  });
}
