import { RequestOptions, ApiResponse } from "@/types";
import { buildParams } from "./buildParams";

export const serverApiClient = async <T>({
  url,
  method = "GET",
  params,
  body,
  headers,
  cache = "no-store",
  responseType = "json",
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
    // Client-side: attempt to read token from cookies if available.
    // Note: The primary auth token is stored with `httpOnly: true` (Rule 13),
    // which prevents client JS/document.cookie access. Authorized requests
    // must run on the server via Server Actions ("use server").
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

  if (!isFormData && !headersInit["Content-Type"] && body !== undefined) {
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

    // Process binary blob responses on successful status
    if (res.ok && responseType === "blob") {
      const blob = await res.blob();
      let filename: string | undefined;

      const disposition = res.headers.get("content-disposition");
      if (disposition) {
        const utf8Match = /filename\*=UTF-8''([^;\n]*)/i.exec(disposition);
        if (utf8Match && utf8Match[1]) {
          try {
            filename = decodeURIComponent(utf8Match[1]);
          } catch {
            filename = utf8Match[1];
          }
        } else {
          const standardMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i.exec(disposition);
          if (standardMatch && standardMatch[1]) {
            filename = standardMatch[1].replace(/['"]/g, "").trim();
            try {
              filename = decodeURIComponent(filename);
            } catch {
              // keep as is
            }
          }
        }
      }

      return {
        success: true,
        message: "تم تحميل الملف بنجاح.",
        data: blob as unknown as T,
        meta: filename ? ({ filename } as unknown as ApiResponse<T>["meta"]) : undefined,
      };
    }

    let data: Record<string, unknown> = {};
    try {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch {
      data = {};
    }

    // Handle 403 Forbidden with CENTER_SUBSCRIPTION_INACTIVE
    if (res.status === 403 && data.code === "CENTER_SUBSCRIPTION_INACTIVE") {
      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/subscription-required") {
          window.location.href = "/subscription-required";
        }
      } else {
        const { redirect } = await import("next/navigation");
        redirect("/subscription-required");
      }

      return {
        success: false,
        message:
          typeof data.message === "string"
            ? data.message
            : "اشتراك المركز غير مفعل أو منتهي الصلاحية.",
        code: "CENTER_SUBSCRIPTION_INACTIVE",
        statusCode: 403,
        data: null as unknown as T,
      };
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
        code: data.code as string | undefined,
        statusCode: 401,
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
        code: data.code as string | undefined,
        statusCode: res.status,
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
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as Record<string, unknown>).digest === "string" &&
      ((error as Record<string, unknown>).digest as string).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

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

