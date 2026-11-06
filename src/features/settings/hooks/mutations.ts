import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCenterSettingsAction } from "../actions/settings-actions";
import { UpdateCenterSettingsDTO } from "../types";
import { settingsKeys } from "./queries";

export function useUpdateCenterSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateCenterSettingsDTO) => {
      const res = await updateCenterSettingsAction(dto);
      if (!res.success) {
        throw new Error(res.message || "فشل تحديث إعدادات المركز");
      }
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.all, data);
      toast.success("تم حفظ إعدادات المركز بنجاح.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الإعدادات.";
      toast.error(message);
    },
  });
}
