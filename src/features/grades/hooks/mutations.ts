import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGradeAction,
  updateGradeAction,
  toggleGradeStatusAction,
  deleteGradeAction,
} from "../actions/grades-actions";
import { type GradeFormValues } from "../schemas/grade-schema";
import { gradesKeys } from "../utils/queryKeys";
import { importFileAction } from "@/lib/export/export-actions";

export function useToggleGradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleGradeStatusAction(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
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
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
    },
  });
}

export function useDeleteGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteGradeAction(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
    },
  });
}

export function useImportGradesMutation() {
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
        `/grades/import/excel?dryRun=${dryRun}`,
        formData
      );
    },
    meta: {
      skipToast: true,
    },
    onSuccess: (result, variables) => {
      if (!variables.dryRun && result.success) {
        queryClient.invalidateQueries({ queryKey: gradesKeys.all });
      }
    },
  });
}


