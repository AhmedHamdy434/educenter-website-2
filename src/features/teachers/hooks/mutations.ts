import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherAction,
  updateTeacherAction,
  toggleTeacherStatusAction,
} from "../actions/teachers-actions";
import { type TeacherFormValues } from "../schemas/teacher-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { teachersKeys } from "../utils/queryKeys";

export function useToggleTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleTeacherStatusAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل حساب المدرس.",
        data: null,
      });
    },
  });
}

export function useCreateTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TeacherFormValues) => {
      return createTeacherAction({
        fullName: values.fullName,
        email: values.email,
        password: values.password || undefined,
        phone: values.phone,
        specialization: values.specialization,
        salary: values.salary,
        bio: values.bio || undefined,
        subjectIds: values.subjectIds,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      }
    },
  });
}

export function useUpdateTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: TeacherFormValues;
    }) => {
      return updateTeacherAction(id, {
        fullName: values.fullName,
        email: values.email,
        password: values.password || undefined,
        phone: values.phone,
        specialization: values.specialization,
        salary: values.salary,
        bio: values.bio || undefined,
        subjectIds: values.subjectIds,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      }
    },
  });
}
