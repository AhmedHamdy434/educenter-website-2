"use server";

import { cookies } from "next/headers";
import { serverApiClient } from "@/lib/api/apiClient";
import { type LoginFormValues } from "../schemas/login-schema";
import { type ApiResponse, type LoginResponseData } from "@/types";

export async function loginAction(
  data: LoginFormValues
): Promise<ApiResponse<LoginResponseData>> {
  const result = await serverApiClient<LoginResponseData>({
    url: "/auth/login",
    method: "POST",
    body: {
      identifier: data.identifier,
      password: data.password,
    },
  });

  if (result && result.success) {
    const token = result.data?.accessToken;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 1 month (30 days - strictly matches backend JWT lifespan)
        path: "/",
      });

      if (result.data?.user?.center?.slug) {
        cookieStore.set("centerSlug", result.data.user.center.slug, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }
    }
  }
  return result;
}
