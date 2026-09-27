"use client";

import { useState, useRef, useCallback } from "react";
import { Download, Upload, FileText, Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/export/file-download";
import { ToolbarExcelConfig, ToolbarPdfConfig } from "@/types/table-toolbar";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TableActionsProps {
  excelConfig?: ToolbarExcelConfig;
  pdfConfig?: ToolbarPdfConfig;
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

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useOnClickOutside(mobileMenuRef, closeMobileMenu);

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
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : "فشل تصدير ملف Excel، حاول مرة أخرى.";
      toast.error(errorMsg);
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
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : "فشل تصدير ملف PDF، حاول مرة أخرى.";
      toast.error(errorMsg);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Unified action definitions to deduplicate desktop and mobile configurations
  const actionItems = [
    {
      key: "import-excel",
      show: hasExcelImport,
      label: "استيراد Excel",
      icon: Upload,
      iconColor: "text-primary",
      onClick: onOpenImport,
      disabled: false,
      loading: false,
    },
    {
      key: "export-excel",
      show: hasExcelExport,
      label: "تصدير Excel",
      icon: Download,
      iconColor: "text-emerald-600",
      onClick: handleExportExcel,
      disabled: isExportDisabled || isExportingExcel,
      loading: isExportingExcel,
    },
    {
      key: "export-pdf",
      show: hasPdf,
      label: "تصدير PDF",
      icon: FileText,
      iconColor: "text-rose-600",
      onClick: handleExportPdf,
      disabled: isExportDisabled || isExportingPdf,
      loading: isExportingPdf,
    },
  ].filter((item) => item.show);

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Buttons */}
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        {actionItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              size="sm"
              onClick={item.onClick}
              disabled={item.disabled}
              className="h-9 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              {item.loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Icon className={cn("h-3.5 w-3.5", item.iconColor)} />
              )}
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Mobile Actions Dropdown */}
      <div className="relative sm:hidden" ref={mobileMenuRef}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="h-9 gap-1 text-xs font-semibold cursor-pointer"
          aria-expanded={isMobileMenuOpen}
          aria-label="قائمة الإجراءات"
        >
          <MoreVertical className="h-4 w-4" />
          <span>الإجراءات</span>
        </Button>

        {isMobileMenuOpen && (
          <div
            className="absolute left-0 mt-1.5 w-44 rounded-lg border border-border bg-card p-1 shadow-lg z-20 space-y-0.5 text-right"
            dir="rtl"
          >
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    item.onClick();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {item.loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Icon className={cn("h-3.5 w-3.5", item.iconColor)} />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
