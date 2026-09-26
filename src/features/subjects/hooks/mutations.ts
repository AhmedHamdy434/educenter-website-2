import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubjectAction,
  updateSubjectAction,
  toggleSubjectStatusAction,
} from "../actions/subjects-actions";
import { type SubjectFormValues } from "../schemas/subject-schema";
import { subjectsKeys } from "../utils/queryKeys";

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

