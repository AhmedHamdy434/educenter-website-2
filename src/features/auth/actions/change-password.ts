"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse, type ChangePasswordDTO } from "@/types";

export async function changePasswordAction(
  data: ChangePasswordDTO
): Promise<ApiResponse<{ message: string }>> {
  return serverApiClient<{ message: string }>({
    url: "/auth/change-password",
    method: "PATCH",
    body: {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    },
  });
}
