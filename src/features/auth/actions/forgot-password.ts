"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse, type ForgotPasswordDTO } from "@/types";

export async function forgotPasswordAction(
  data: ForgotPasswordDTO
): Promise<ApiResponse<{ message: string }>> {
  return serverApiClient<{ message: string }>({
    url: "/auth/forgot-password",
    method: "POST",
    body: {
      email: data.email,
    },
  });
}
