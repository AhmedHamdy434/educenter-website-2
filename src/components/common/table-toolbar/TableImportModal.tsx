"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/export/file-download";
import { ExcelImportSummary, RowValidationError } from "@/types/table-toolbar";
import { type ApiResponse } from "@/types";
import { toast } from "sonner";

interface TableImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  templateEndpoint?: string;
  onImportSuccess?: () => void;
  onImport: (params: {
    file: File;
    dryRun?: boolean;
  }) => Promise<ApiResponse<ExcelImportSummary>>;
}

export function TableImportModal({
  isOpen,
  onClose,
  title = "استيراد البيانات من ملف Excel",
  templateEndpoint,
  onImportSuccess,
  onImport,
}: TableImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<ExcelImportSummary | null>(null);
  const [errors, setErrors] = useState<RowValidationError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setSummary(null);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTemplateDownload = async () => {
    if (!templateEndpoint) return;
    try {
      setIsDownloadingTemplate(true);
      await downloadFile({
        url: templateEndpoint,
        defaultFileName: "import-template.xlsx",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل تحميل القالب.";
      toast.error(msg);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls")
    ) {
      toast.error("يرجى اختيار ملف Excel بصيغة .xlsx فقط.");
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setSummary(null);

    // Call backend dryRun=true to preview & validate without saving
    try {
      setIsValidating(true);
      const res = await onImport({ file: selectedFile, dryRun: true });

      if (!res.success) {
        // Validation errors returned by backend (e.g. 422)
        const summaryData = (res.data || {}) as ExcelImportSummary;
        if (summaryData?.errors && Array.isArray(summaryData.errors)) {
          setErrors(summaryData.errors);
          setSummary(summaryData);
        } else {
          toast.error(res.message || "الملف غير صالح للاستيراد.");
        }
        return;
      }

      // Valid dryRun response
      const validSummary: ExcelImportSummary = res.data;
      setSummary(validSummary);
      setErrors([]);
    } catch {
      toast.error("فشل فحص الملف، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!file) return;

    try {
      setIsSubmitting(true);
      const res = await onImport({ file, dryRun: false });

      if (!res.success) {
        toast.error(res.message || "حدث خطأ أثناء استيراد البيانات.");
        return;
      }
      onImportSuccess?.();
      handleClose();
    } catch {
      toast.error("حدث خطأ في الاتصال أثناء تأكيد الاستيراد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SharedModal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-5 text-right" dir="rtl">
        {/* Template Download Banner */}
        {templateEndpoint && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3.5">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  قالب Excel النموذجي
                </p>
                <p className="text-[11px] text-muted-foreground">
                  استخدم هذا القالب لضمان مطابقة أسماء الأعمدة والتنسيقات.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTemplateDownload}
              disabled={isDownloadingTemplate}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              {isDownloadingTemplate ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              تحميل القالب
            </Button>
          </div>
        )}

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) handleFileSelect(dropped);
          }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/60 cursor-pointer bg-card"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFileSelect(selected);
            }}
          />
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-xs font-semibold text-foreground">
            انقر لاختيار ملف أو اسحبه إلى هنا
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            يدعم ملفات Excel (.xlsx) بحد أقصى 3 ميجابايت
          </p>
          {file && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <span>{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Validation Spinner */}
        {isValidating && (
          <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>جاري فحص وتدقيق الملف من السيرفر...</span>
          </div>
        )}

        {/* Summary (Valid State) */}
        {!isValidating && summary && errors.length === 0 && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              الملف جاهز للاستيراد بنجاح! تم التحقق من{" "}
              <strong>{summary.totalRows}</strong> صف مطابق للمعايير.
            </span>
          </div>
        )}

        {/* Error List */}
        {!isValidating && errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>يوجد {errors.length} خطأ في البيانات يمنع الاستيراد:</span>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-destructive/20 bg-destructive/5 p-2 space-y-1 text-xs">
              {errors.slice(0, 50).map((err, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-[11px] text-destructive/90 pb-1 border-b border-destructive/10 last:border-none"
                >
                  <span className="font-bold shrink-0">صف {err.row}:</span>
                  <span>{err.message}</span>
                </div>
              ))}
              {errors.length > 50 && (
                <p className="text-[10px] text-muted-foreground text-center pt-1">
                  ... ويوجد {errors.length - 50} خطأ إضافي
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={handleConfirmImport}
            disabled={
              !file ||
              isValidating ||
              errors.length > 0 ||
              isSubmitting ||
              !summary
            }
            className="gap-1.5 font-semibold"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            تأكيد واستيراد البيانات
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}
