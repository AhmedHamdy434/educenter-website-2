"use server";

import { cookies } from "next/headers";
import { type ApiResponse } from "@/types";

export async function logoutAction(): Promise<ApiResponse<null>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("centerSlug");

    return {
      success: true,
      message: "تم تسجيل الخروج بنجاح",
      data: null,
    };
  } catch (error) {
    console.error("Error during logout action:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء محاولة تسجيل الخروج. يرجى المحاولة مرة أخرى.",
      data: null,
    };
  }
}
