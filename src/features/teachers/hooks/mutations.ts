import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherAction,
  updateTeacherAction,
  toggleTeacherStatusAction,
  deleteTeacherAction,
} from "../actions/teachers-actions";
import { importFileAction } from "@/lib/export/export-actions";
import { type TeacherFormValues } from "../schemas/teacher-schema";
import { teachersKeys } from "../utils/queryKeys";
import { gradesKeys } from "@/features/grades/utils/queryKeys";
import { subjectsKeys } from "@/features/subjects/utils/queryKeys";

export function useToggleTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleTeacherStatusAction(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      }
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
        bio: values.bio || undefined,
        subjectIds: values.subjectIds,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
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
        bio: values.bio || undefined,
        subjectIds: values.subjectIds,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      }
    },
  });
}

export function useDeleteTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteTeacherAction(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}

export function useImportTeachersMutation() {
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
        `/teachers/import/excel?dryRun=${dryRun}`,
        formData,
      );
    },
    meta: {
      skipToast: true,
    },
    onSuccess: (result, variables) => {
      if (!variables.dryRun && result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}
