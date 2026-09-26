"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { TableSearch } from "@/components/common/TableSearch";
import { Button } from "@/components/ui/button";
import { TableFilterPanel } from "./TableFilterPanel";
import { TableActions } from "./TableActions";
import { TableImportModal } from "./TableImportModal";
import { TableToolbarProps } from "@/types/table-toolbar";
import { useSearchParams } from "next/navigation";

export function TableToolbar<TData, TFilters extends Record<string, string | undefined>>({
  searchPlaceholder = "ابحث هنا...",
  searchParamName = "search",
  filters = [],
  filterValues = {} as TFilters,
  onFilterChange,
  excelConfig,
  pdfConfig,
  columns = [],
  totalRecords = 0,
  isLoading = false,
  className = "",
  onImport,
  onImportSuccess,
}: TableToolbarProps<TData, TFilters>) {
  const searchParams = useSearchParams();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Count active filters (ignoring search, page, limit, sort)
  const activeCount = useMemo(() => {
    return filters.filter((f) => {
      const val = filterValues[f.key];
      return val !== undefined && val !== null && val !== "" && val !== "all";
    }).length;
  }, [filters, filterValues]);

  // Open filter panel by default if there are active filters in URL
  const [isPanelOpen, setIsPanelOpen] = useState(() => activeCount > 0);

  // Collect current query params for export (search, sort, filters) without page and limit
  const currentParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {};
    const searchVal = searchParams.get(searchParamName);
    if (searchVal) params[searchParamName] = searchVal;

    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params["sortBy"] = sortBy;
    if (sortOrder) params["sortOrder"] = sortOrder;

    filters.forEach((f) => {
      const val = filterValues[f.key];
      if (val !== undefined && val !== null && val !== "") {
        params[f.key] = val;
      }
    });

    return params;
  }, [searchParams, searchParamName, filters, filterValues]);

  return (
    <div className={`space-y-3 ${className}`} dir="rtl">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1">
        {/* Search & Filter Trigger */}
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="flex-1">
            <TableSearch placeholder={searchPlaceholder} paramName={searchParamName} />
          </div>

          {filters.length > 0 && (
            <Button
              type="button"
              variant={isPanelOpen || activeCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPanelOpen((prev) => !prev)}
              className="h-9 gap-1.5 shrink-0 text-xs font-semibold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>الفلاتر</span>
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground px-1 text-[11px] font-bold text-primary">
                  {activeCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Export & Import Actions */}
        <TableActions
          excelConfig={excelConfig}
          pdfConfig={pdfConfig}
          columns={columns}
          currentParams={currentParams}
          totalRecords={totalRecords}
          isLoading={isLoading}
          hasImport={Boolean(onImport)}
          onOpenImport={() => setIsImportModalOpen(true)}
        />
      </div>

      {/* Collapsible Filter Panel */}
      {filters.length > 0 && onFilterChange && (
        <TableFilterPanel
          isOpen={isPanelOpen}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          activeCount={activeCount}
          isLoading={isLoading}
        />
      )}

      {/* Excel Import Modal */}
      {onImport && (
        <TableImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          templateEndpoint={excelConfig?.templateEndpoint}
          onImport={onImport}
          onImportSuccess={onImportSuccess}
        />
      )}
    </div>
  );
}
