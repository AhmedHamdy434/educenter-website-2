import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubjectAction,
  updateSubjectAction,
  toggleSubjectStatusAction,
} from "../actions/subjects-actions";
import { type SubjectFormValues } from "../schemas/subject-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { subjectsKeys } from "../utils/queryKeys";

export function useToggleSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleSubjectStatusAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل المادة الدراسية.",
        data: null,
      });
    },
  });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SubjectFormValues) => {
      return createSubjectAction(values);
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Omit<SubjectFormValues, "gradeId">;
    }) => {
      return updateSubjectAction(id, {
        name: values.name,
        description: values.description,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}
