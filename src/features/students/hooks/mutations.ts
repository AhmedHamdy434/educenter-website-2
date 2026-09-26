import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStudentAction,
  updateStudentAction,
  toggleStudentStatusAction,
} from "../actions/students-actions";
import { importFileAction } from "@/lib/export/export-actions";
import { type StudentFormValues } from "../schemas/student-schema";
import { studentsKeys } from "../utils/queryKeys";

export function useToggleStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleStudentStatusAction(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      }
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
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      }
    },
  });
}

export function useImportStudentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      dryRun = false,
    }: {
      file: File;
      dryRun?: boolean;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      return importFileAction(
        `/students/import/excel?dryRun=${dryRun}`,
        formData,
      );
    },
    meta: {
      skipToast: true,
    },
    onSuccess: (result, variables) => {
      if (!variables.dryRun && result.success) {
        queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      }
    },
  });
}
