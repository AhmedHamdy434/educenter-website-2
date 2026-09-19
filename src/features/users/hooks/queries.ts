"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions/users-actions";
import { type UserListItem, type UserFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export const USERS_QUERY_KEY = ["center-users"];

export function useUsersQuery(
  params: UserFilterParams,
  initialData?: ApiResponse<UserListItem[]>
) {
  return useQuery<ApiResponse<UserListItem[]>>({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => getUsers(params),
    initialData,
  });
}
