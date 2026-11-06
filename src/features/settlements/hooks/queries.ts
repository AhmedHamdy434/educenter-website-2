import { useQuery } from "@tanstack/react-query";
import {
  getTeachersFinancialOverviewAction,
  getTeacherUnsettledEarningsAction,
  getSettlementsAction,
  getSettlementByIdAction,
  GetSettlementsParams,
} from "../actions/settlements-actions";

export const settlementsKeys = {
  all: ["teacher-settlements"] as const,
  overview: (search?: string) => [...settlementsKeys.all, "overview", search] as const,
  unsettled: (teacherId: string) => [...settlementsKeys.all, "unsettled", teacherId] as const,
  list: (params?: GetSettlementsParams) => [...settlementsKeys.all, "list", params] as const,
  detail: (id: string) => [...settlementsKeys.all, "detail", id] as const,
};

export function useTeachersFinancialOverviewQuery(search?: string) {
  return useQuery({
    queryKey: settlementsKeys.overview(search),
    queryFn: async () => {
      const res = await getTeachersFinancialOverviewAction(search);
      if (!res.success) throw new Error(res.message || "فشل جلب النظرة المالية للمعلمين");
      return res.data;
    },
  });
}

export function useTeacherUnsettledEarningsQuery(teacherId: string, enabled = true) {
  return useQuery({
    queryKey: settlementsKeys.unsettled(teacherId),
    queryFn: async () => {
      const res = await getTeacherUnsettledEarningsAction(teacherId);
      if (!res.success) throw new Error(res.message || "فشل جلب مستحقات المعلم غير المسواة");
      return res.data;
    },
    enabled: enabled && !!teacherId,
  });
}

export function useSettlementsQuery(params?: GetSettlementsParams) {
  return useQuery({
    queryKey: settlementsKeys.list(params),
    queryFn: async () => {
      const res = await getSettlementsAction(params);
      if (!res.success) throw new Error(res.message || "فشل جلب سجل التسويات المالية");
      return res;
    },
  });
}

export function useSettlementDetailsQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: settlementsKeys.detail(id),
    queryFn: async () => {
      const res = await getSettlementByIdAction(id);
      if (!res.success) throw new Error(res.message || "فشل جلب تفاصيل التسوية");
      return res.data;
    },
    enabled: enabled && !!id,
  });
}

