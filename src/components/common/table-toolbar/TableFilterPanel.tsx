"use client";

import { X } from "lucide-react";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { Button } from "@/components/ui/button";
import { FilterConfig } from "@/types/table-toolbar";

interface TableFilterPanelProps<TFilters extends Record<string, string | undefined>> {
  isOpen: boolean;
  filters: FilterConfig<Extract<keyof TFilters, string>>[];
  filterValues: TFilters;
  onFilterChange: (updates: Partial<TFilters> & { page?: number }) => void;
  activeCount: number;
}

export function TableFilterPanel<TFilters extends Record<string, string | undefined>>({
  isOpen,
  filters,
  filterValues,
  onFilterChange,
  activeCount,
}: TableFilterPanelProps<TFilters>) {
  if (!isOpen || filters.length === 0) return null;

  const handleClearFilters = () => {
    const clearedUpdates: Record<string, string | number | undefined> = {
      page: 1,
    };
    filters.forEach((f) => {
      clearedUpdates[f.key] = undefined;
    });
    onFilterChange(clearedUpdates as unknown as Partial<TFilters> & { page?: number });
  };

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4 transition-all" dir="rtl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end">
        {filters.map((filter) => {
          const currentValue = filterValues[filter.key] ?? "";
          return (
            <div key={filter.key} className="space-y-1">
              <FilterDropdown
                label={filter.label}
                placeholder={filter.placeholder}
                allOptionLabel={filter.allOptionLabel}
                options={filter.options}
                value={String(currentValue)}
                onChange={(val) => {
                  onFilterChange({
                    [filter.key]: val || undefined,
                    page: 1,
                  } as unknown as Partial<TFilters> & { page?: number });
                }}
              />
            </div>
          );
        })}

        {activeCount > 0 && (
          <div className="flex items-center sm:justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
            >
              <X className="h-3.5 w-3.5" />
              مسح الفلاتر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
