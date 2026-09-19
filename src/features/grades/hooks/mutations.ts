import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGradeAction,
  updateGradeAction,
  toggleGradeStatusAction,
} from "../actions/grades-actions";
import { type GradeFormValues } from "../schemas/grade-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { gradesKeys } from "../utils/queryKeys";

export function useToggleGradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleGradeStatusAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: gradesKeys.all });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل المرحلة الدراسية.",
        data: null,
      });
    },
  });
}

export function useCreateGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: GradeFormValues) => {
      return createGradeAction(values);
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
    },
  });
}

export function useUpdateGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: GradeFormValues;
    }) => {
      return updateGradeAction(id, values);
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
    },
  });
}
