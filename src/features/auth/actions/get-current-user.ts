import { cookies } from "next/headers";
import { serverApiClient } from "@/lib/api/apiClient";
import { type User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const response = await serverApiClient<User>({
      url: "/auth/me",
      method: "GET",
      cache: "no-store",
    });

    if (response && response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
  return null;
}

