import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSettlementAction,
  completeSettlementAction,
  cancelSettlementAction,
  createRefundAction,
} from "../actions/settlements-actions";
import { CreateSettlementDTO, CreateRefundDTO } from "../types";
import { settlementsKeys } from "./queries";
import { dashboardKeys } from "@/features/dashboard/utils/queryKeys";

export function useCreateSettlementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateSettlementDTO) => {
      const res = await createSettlementAction(dto);
      if (!res.success) throw new Error(res.message || "فشل تسجيل التسوية المالية");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("تم تسجيل وصرف التسوية المالية بنجاح.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل التسوية.";
      toast.error(message);
    },
  });
}

export function useCompleteSettlementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await completeSettlementAction(id);
      if (!res.success) throw new Error(res.message || "فشل تأكيد صرف التسوية");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("تم تأكيد وصرف التسوية بنجاح.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء تأكيد التسوية.";
      toast.error(message);
    },
  });
}

export function useCancelSettlementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await cancelSettlementAction(id, reason);
      if (!res.success) throw new Error(res.message || "فشل إلغاء التسوية");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("تم إلغاء التسوية وفك حجز المستحقات بنجاح.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء إلغاء التسوية.";
      toast.error(message);
    },
  });
}

export function useCreateRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateRefundDTO) => {
      const res = await createRefundAction(dto);
      if (!res.success) throw new Error(res.message || "فشل تسجيل الاسترداد");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("تم تسجيل الاسترداد المالي بنجاح.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء تنفيذ الاسترداد.";
      toast.error(message);
    },
  });
}
