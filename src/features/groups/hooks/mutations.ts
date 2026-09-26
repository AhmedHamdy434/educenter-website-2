import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
  toggleGroupStatusAction,
  addStudentsToGroupAction,
  removeStudentsFromGroupAction,
  payGroupStudentMonthAction,
} from "../actions/groups-actions";
import { type GroupFormValues } from "../schemas/group-schema";
import { groupsKeys } from "../utils/queryKeys";
import { importFileAction } from "@/lib/export/export-actions";

export function useToggleGroupStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleGroupStatusAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: GroupFormValues) => {
      return createGroupAction({
        name: values.name,
        gradeId: values.gradeId,
        subjectId: values.subjectId,
        teacherId: values.teacherId,
        capacity: values.capacity || undefined,
        schedule: values.schedule,
        monthlyFee: values.monthlyFee,
        startDate: values.startDate,
        monthsCount: values.monthsCount,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: GroupFormValues;
    }) => {
      return updateGroupAction(id, {
        name: values.name,
        gradeId: values.gradeId,
        subjectId: values.subjectId,
        teacherId: values.teacherId,
        capacity: values.capacity || undefined,
        schedule: values.schedule,
        monthlyFee: values.monthlyFee,
        startDate: values.startDate,
        monthsCount: values.monthsCount,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteGroupAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });
}

export function useAddStudentsToGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      studentIds,
      subscriptionStartDate,
    }: {
      id: string;
      studentIds: string[];
      subscriptionStartDate?: string;
    }) => addStudentsToGroupAction(id, studentIds, subscriptionStartDate),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useRemoveStudentsFromGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      studentIds,
    }: {
      id: string;
      studentIds: string[];
    }) => removeStudentsFromGroupAction(id, studentIds),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function usePayGroupStudentMonthMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupStudentId,
      subscriptionDate,
      notes,
    }: {
      groupStudentId: string;
      subscriptionDate: string;
      notes?: string;
    }) => payGroupStudentMonthAction(groupStudentId, subscriptionDate, notes),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate groups and student payments caches
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
        queryClient.invalidateQueries({ queryKey: ["students", "payments"] });
      }
    },
  });
}

export function useImportGroupsMutation() {
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
        `/groups/import/excel?dryRun=${dryRun}`,
        formData,
      );
    },
    meta: {
      skipToast: true,
    },
    onSuccess: (result, variables) => {
      if (!variables.dryRun && result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}
