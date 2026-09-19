import { RequestOptions, ApiResponse } from "@/types";
import { buildParams } from "./buildParams";

export const serverApiClient = async <T>({
  url,
  method = "GET",
  params,
  body,
  headers,
  cache = "no-store",
}: RequestOptions): Promise<ApiResponse<T>> => {
  let token: string | undefined;

  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    } catch {
      // Cookies may be unavailable in some server execution contexts
    }
  } else {
    // Client-side: read token from cookies
    token = document.cookie
      .split("; ")
      .find((row) => row.trim().startsWith("token="))
      ?.split("=")[1];
  }

  const query = buildParams(params);
  const queryString = query ? `?${query}` : "";
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headersInit: Record<string, string> = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...(headers as Record<string, string>),
  };

  if (!isFormData && !headersInit["Content-Type"]) {
    headersInit["Content-Type"] = "application/json";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api${url}${queryString}`, {
      method,
      headers: headersInit,
      body: body
        ? isFormData
          ? (body as FormData)
          : JSON.stringify(body)
        : undefined,
      cache,
    });

    // Capture subscription grace period warning header if present
    const warningHeader = res.headers.get("x-subscription-warning");
    if (warningHeader && typeof window !== "undefined") {
      try {
        const { useSubscriptionStore } = await import(
          "@/features/subscription/state/useSubscriptionStore"
        );
        useSubscriptionStore.getState().setWarning(warningHeader);
      } catch {
        // Ignore store import error in non-browser context
      }
    }

    let data: Record<string, unknown> = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Handle 401 Unauthorized (expired or invalid token)
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      } else {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          cookieStore.delete("token");
        } catch {
          // Mutating cookies during RSC render is not allowed by Next.js and safely ignored
        }
      }

      const rawMsg = data.message;
      const message = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : typeof rawMsg === "string"
        ? rawMsg
        : "انتهت صلاحية الجلسة أو غير مصرح لك بالوصول. يرجى تسجيل الدخول مجدداً.";

      return {
        success: false,
        message,
        data: null as unknown as T,
      };
    }

    if (!res.ok) {
      const rawMsg = data.message;
      const errorMessage = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : typeof rawMsg === "string"
        ? rawMsg
        : "حدث خطأ أثناء معالجة الطلب.";

      return {
        success: false,
        message: errorMessage,
        data: (data.data ?? null) as unknown as T,
        ...(data.meta ? { meta: data.meta as ApiResponse<T>["meta"] } : {}),
      };
    }

    return {
      success: (data.success as boolean) ?? true,
      message: (data.message as string) || "",
      data: (data.data !== undefined ? data.data : data) as T,
      ...(data.meta ? { meta: data.meta as ApiResponse<T>["meta"] } : {}),
    };
  } catch (error) {
    console.error("Error during API request:", error);
    const errorMessage =
      "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.";

    return {
      success: false,
      message: errorMessage,
      data: null as unknown as T,
    };
  }
};

