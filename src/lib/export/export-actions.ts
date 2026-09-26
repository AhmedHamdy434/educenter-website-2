"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import { ExcelImportSummary } from "@/types/table-toolbar";

export interface ExportFileResult {
  success: boolean;
  message?: string;
  data?: {
    base64: string;
    filename?: string;
    mimeType: string;
  };
}

/**
 * Server action to download/export files (Excel, PDF, etc.) securely using serverApiClient.
 * Runs on Next.js server, where it has secure access to httpOnly token cookies,
 * eliminating 401 Unauthorized errors in the browser.
 */
export async function exportFileAction({
  url,
  params,
}: {
  url: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}): Promise<ExportFileResult> {
  const res = await serverApiClient<Blob>({
    url,
    method: "GET",
    params,
    responseType: "blob",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: res.message || "تعذر تحميل الملف من الخادم.",
    };
  }

  try {
    const arrayBuffer = await res.data.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const meta = res.meta as Record<string, unknown> | undefined;
    const filename = meta?.filename as string | undefined;

    return {
      success: true,
      data: {
        base64,
        filename,
        mimeType: res.data.type || "application/octet-stream",
      },
    };
  } catch (error) {
    console.error("Error converting export blob to base64:", error);
    return {
      success: false,
      message: "فشل تجهيز بيانات الملف للتحميل.",
    };
  }
}

/**
 * Server action to import Excel files securely using serverApiClient with httpOnly auth cookie.
 */
export async function importFileAction(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<ExcelImportSummary>> {
  return serverApiClient<ExcelImportSummary>({
    url: endpoint,
    method: "POST",
    body: formData,
  });
}
