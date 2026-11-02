import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExtraSessionAction,
  updateExtraSessionAction,
  cancelExtraSessionAction,
  addExtraSessionStudentsAction,
  payExtraSessionStudentAction,
  waiveExtraSessionStudentAction,
} from "../actions/extra-sessions-actions";
import { extraSessionsKeys } from "../utils/queryKeys";
import { scheduleKeys } from "@/features/schedule/utils/queryKeys";
import { groupsKeys } from "@/features/groups/utils/queryKeys";
import {
  CreateExtraSessionDTO,
  UpdateExtraSessionDTO,
  CancelExtraSessionDTO,
  AddExtraSessionStudentsDTO,
  PayExtraSessionStudentDTO,
  WaiveExtraSessionStudentDTO,
} from "../types";

export function useCreateExtraSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateExtraSessionDTO;
    }) => {
      return createExtraSessionAction(groupId, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useUpdateExtraSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExtraSessionDTO;
    }) => {
      return updateExtraSessionAction(id, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      }
    },
  });
}

export function useCancelExtraSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CancelExtraSessionDTO;
    }) => {
      return cancelExtraSessionAction(id, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      }
    },
  });
}

export function useAddExtraSessionStudentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AddExtraSessionStudentsDTO;
    }) => {
      return addExtraSessionStudentsAction(id, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
      }
    },
  });
}

export function usePayExtraSessionStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      studentId,
      data,
    }: {
      id: string;
      studentId: string;
      data: PayExtraSessionStudentDTO;
    }) => {
      return payExtraSessionStudentAction(id, studentId, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
      }
    },
  });
}

export function useWaiveExtraSessionStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      studentId,
      data,
    }: {
      id: string;
      studentId: string;
      data: WaiveExtraSessionStudentDTO;
    }) => {
      return waiveExtraSessionStudentAction(id, studentId, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: extraSessionsKeys.all });
      }
    },
  });
}
