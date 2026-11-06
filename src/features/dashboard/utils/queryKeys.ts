import { GetDashboardParams } from "../actions/dashboard-actions";

export const dashboardKeys = {
  all: ["owner-dashboard"] as const,
  data: (params?: GetDashboardParams) =>
    [...dashboardKeys.all, "data", params] as const,
};