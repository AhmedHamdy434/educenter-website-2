"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse, type ResetPasswordDTO } from "@/types";

export async function resetPasswordAction(
  data: ResetPasswordDTO
): Promise<ApiResponse<{ message: string }>> {
  return serverApiClient<{ message: string }>({
    url: "/auth/reset-password",
    method: "POST",
    body: {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    },
  });
}
