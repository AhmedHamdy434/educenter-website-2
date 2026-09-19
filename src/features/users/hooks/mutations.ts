"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatusAction } from "../actions/users-actions";
import { type UserListItem } from "../types";
import { type ApiResponse } from "@/types";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { USERS_QUERY_KEY } from "./queries";

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserListItem>,
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => updateUserStatusAction(id, isActive),
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      }
    },
  });
}
