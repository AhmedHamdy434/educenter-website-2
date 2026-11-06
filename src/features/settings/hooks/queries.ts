import { useQuery } from "@tanstack/react-query";
import { getCenterSettingsAction } from "../actions/settings-actions";

export const settingsKeys = {
  all: ["center-settings"] as const,
};

export function useCenterSettingsQuery() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => {
      const res = await getCenterSettingsAction();
      if (!res.success) {
        throw new Error(res.message || "فشل جلب إعدادات المركز");
      }
      return res.data;
    },
  });
}

