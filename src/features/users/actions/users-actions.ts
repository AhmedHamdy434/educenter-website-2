"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type UserListItem, type UserFilterParams } from "../types";
import { type ApiResponse } from "@/types";

export async function getUsers(
  params: UserFilterParams
): Promise<ApiResponse<UserListItem[]>> {
  return serverApiClient<UserListItem[]>({
    url: "/users",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function updateUserStatusAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<UserListItem>> {
  return serverApiClient<UserListItem>({
    url: `/users/${id}`,
    method: "PATCH",
    body: { isActive },
  });
}
