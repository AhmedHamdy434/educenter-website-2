import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startOrGetSessionAction,
  saveAttendanceAction,
} from "../actions/attendance-actions";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { attendanceKeys } from "./queries";
import { type SaveAttendanceDTO } from "../types";

export function useStartAttendanceSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => startOrGetSessionAction(groupId),
    onSuccess: (result, groupId) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupSessions(groupId),
        });
      }
    },
  });
}

export function useSaveAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      sessionId,
      data,
    }: {
      groupId: string;
      sessionId: string;
      data: SaveAttendanceDTO;
    }) => saveAttendanceAction(groupId, sessionId, data),
    onSuccess: (result, variables) => {
      handleResponseToast(result);
      if (result.success) {
        // Invalidate session details, session history list and group reports
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.sessionDetails(variables.groupId, variables.sessionId),
        });
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupSessions(variables.groupId),
        });
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupReport(variables.groupId),
        });
      }
    },
  });
}
