import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startOrGetSessionAction,
  saveAttendanceAction,
} from "../actions/attendance-actions";
import { attendanceKeys } from "./queries";
import { scheduleKeys } from "@/features/schedule/utils/queryKeys";
import { type SaveAttendanceDTO } from "../types";

export function useStartAttendanceSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => startOrGetSessionAction(groupId),
    onSuccess: (result, groupId) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupSessions(groupId),
        });
        queryClient.invalidateQueries({
          queryKey: scheduleKeys.all,
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
      if (result.success) {
        // Invalidate session details, session history list, group reports, and all attendance queries
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.sessionDetails(variables.groupId, variables.sessionId),
        });
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupSessions(variables.groupId),
        });
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.groupReport(variables.groupId),
        });
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.all,
        });
        queryClient.invalidateQueries({
          queryKey: scheduleKeys.all,
        });
      }
    },
  });
}
