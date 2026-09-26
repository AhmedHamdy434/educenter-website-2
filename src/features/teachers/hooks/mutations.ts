import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherAction,
  updateTeacherAction,
  toggleTeacherStatusAction,
} from "../actions/teachers-actions";
import { type TeacherFormValues } from "../schemas/teacher-schema";
import { teachersKeys } from "../utils/queryKeys";

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
        specialization: values.specialization,
        salary: values.salary,
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
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      }
    },
  });
}

