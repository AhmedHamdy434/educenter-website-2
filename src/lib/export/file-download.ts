"use client";

import { exportFileAction } from "./export-actions";

export interface DownloadFileOptions {
  url: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  defaultFileName?: string;
}

/**
 * Triggers a direct browser file download from a Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

/**
 * Downloads a file (e.g. Excel .xlsx or PDF .pdf) from the API.
 * Uses exportFileAction Server Action which executes on the Next.js server,
 * reading the secure httpOnly token cookie and calling serverApiClient with
 * full authorization, preventing 401 Unauthorized errors in the browser.
 */
export async function downloadFile({
  url,
  params,
  defaultFileName = "download.xlsx",
}: DownloadFileOptions): Promise<void> {
  const result = await exportFileAction({ url, params });

  if (!result.success || !result.data) {
    throw new Error(result.message || "تعذر تحميل الملف من الخادم.");
  }

  const { base64, filename, mimeType } = result.data;
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });

  downloadBlob(blob, filename || defaultFileName);
}

