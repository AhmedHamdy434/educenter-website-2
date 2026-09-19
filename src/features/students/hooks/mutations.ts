import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStudentAction,
  updateStudentAction,
  toggleStudentStatusAction,
} from "../actions/students-actions";
import { type StudentFormValues } from "../schemas/student-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { studentsKeys } from "../utils/queryKeys";

export function useToggleStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleStudentStatusAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل حساب الطالب.",
        data: null,
      });
    },
  });
}

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: StudentFormValues) => {
      return createStudentAction({
        fullName: values.fullName,
        email: values.email,
        password: values.password || undefined,
        phone: values.phone,
        parentPhone: values.parentPhone,
        notes: values.notes || undefined,
        gradeId: values.gradeId,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      }
    },
  });
}

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: StudentFormValues;
    }) => {
      return updateStudentAction(id, {
        fullName: values.fullName,
        email: values.email,
        password: values.password || undefined,
        phone: values.phone,
        parentPhone: values.parentPhone,
        notes: values.notes || undefined,
        gradeId: values.gradeId,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      }
    },
  });
}
