import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubjectAction,
  updateSubjectAction,
  toggleSubjectStatusAction,
  deleteSubjectAction,
} from "../actions/subjects-actions";
import { type SubjectFormValues } from "../schemas/subject-schema";
import { subjectsKeys } from "../utils/queryKeys";
import { importFileAction } from "@/lib/export/export-actions";

export function useToggleSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleSubjectStatusAction(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
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
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteSubjectAction(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}

export function useImportSubjectsMutation() {
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
        `/subjects/import/excel?dryRun=${dryRun}`,
        formData,
      );
    },
    meta: {
      skipToast: true,
    },
    onSuccess: (result, variables) => {
      if (!variables.dryRun && result.success) {
        queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
      }
    },
  });
}

