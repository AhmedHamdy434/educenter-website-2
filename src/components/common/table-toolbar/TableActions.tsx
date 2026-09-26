"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, FileText, Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/export/file-download";
import { ToolbarExcelConfig, ToolbarPdfConfig } from "@/types/table-toolbar";

interface TableActionsProps {
  excelConfig?: ToolbarExcelConfig;
  pdfConfig?: ToolbarPdfConfig;
  columns?: unknown;
  currentParams?: Record<string, string | number | undefined>;
  totalRecords?: number;
  isLoading?: boolean;
  hasImport?: boolean;
  onOpenImport: () => void;
}

export function TableActions({
  excelConfig,
  pdfConfig,
  currentParams = {},
  totalRecords = 0,
  isLoading = false,
  hasImport,
  onOpenImport,
}: TableActionsProps) {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasExcelExport = Boolean(excelConfig?.exportEndpoint);
  const hasExcelImport = Boolean(hasImport);
  const hasPdf = Boolean(pdfConfig?.exportEndpoint);

  if (!hasExcelExport && !hasExcelImport && !hasPdf) {
    return null;
  }

  const isExportDisabled = isLoading || totalRecords === 0;

  const handleExportExcel = async () => {
    if (!excelConfig?.exportEndpoint || isExportDisabled) return;
    try {
      setIsExportingExcel(true);
      await downloadFile({
        url: excelConfig.exportEndpoint,
        params: currentParams,
        defaultFileName: excelConfig.fileName || "export.xlsx",
      });
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    if (!pdfConfig?.exportEndpoint || isExportDisabled) return;
    try {
      setIsExportingPdf(true);
      await downloadFile({
        url: pdfConfig.exportEndpoint,
        params: currentParams,
        defaultFileName: pdfConfig.fileName || `${pdfConfig.title || "document"}.pdf`,
      });
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Buttons */}
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        {hasExcelImport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenImport}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5 text-primary" />
            استيراد Excel
          </Button>
        )}

        {hasExcelExport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExportDisabled || isExportingExcel}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            {isExportingExcel ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 text-emerald-600" />
            )}
            تصدير Excel
          </Button>
        )}

        {hasPdf && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExportDisabled || isExportingPdf}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            {isExportingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-rose-600" />
            )}
            تصدير PDF
          </Button>
        )}
      </div>

      {/* Mobile Actions Dropdown */}
      <div className="relative sm:hidden" ref={mobileMenuRef}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="h-9 gap-1 text-xs font-semibold"
        >
          <MoreVertical className="h-4 w-4" />
          الإجراءات
        </Button>

        {isMobileMenuOpen && (
          <div className="absolute left-0 mt-1.5 w-44 rounded-lg border border-border bg-card p-1 shadow-lg z-20 space-y-0.5 text-right" dir="rtl">
            {hasExcelImport && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenImport();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                استيراد Excel
              </button>
            )}

            {hasExcelExport && (
              <button
                type="button"
                disabled={isExportDisabled || isExportingExcel}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleExportExcel();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                {isExportingExcel ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                )}
                تصدير Excel
              </button>
            )}

            {hasPdf && (
              <button
                type="button"
                disabled={isExportDisabled || isExportingPdf}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleExportPdf();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                {isExportingPdf ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-rose-600" />
                )}
                تصدير PDF
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
