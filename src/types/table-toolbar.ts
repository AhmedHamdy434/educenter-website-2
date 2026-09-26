import "@tanstack/react-table";
import { type ApiResponse } from "@/types";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    exportHeader?: string;
    exportValue?: (row: TData) => string | number;
  }
}

export type FilterFieldType = "select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface BaseFilterConfig<TKey extends string = string> {
  key: TKey;
  label: string;
  placeholder?: string;
}

export interface SelectFilterConfig<TKey extends string = string>
  extends BaseFilterConfig<TKey> {
  type: "select";
  options: FilterOption[];
  allOptionLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export type FilterConfig<TKey extends string = string> = SelectFilterConfig<TKey>;

export interface RowValidationError {
  row: number;
  field: string;
  value?: unknown;
  message: string;
}

export interface ExcelImportSummary<T = unknown> {
  totalRows: number;
  validRows: number;
  failedRows: number;
  remainingErrorsCount?: number;
  errors: RowValidationError[];
  data?: T[];
}

export interface ToolbarExcelConfig {
  exportEndpoint?: string;
  templateEndpoint?: string;
  fileName?: string;
}

export interface ToolbarPdfConfig {
  exportEndpoint?: string;
  fileName?: string;
  title?: string;
}

export interface TableToolbarProps<TData, TFilters extends Record<string, string | undefined>> {
  searchPlaceholder?: string;
  searchParamName?: string;
  filters?: FilterConfig<Extract<keyof TFilters, string>>[];
  filterValues?: TFilters;
  onFilterChange?: (updates: Partial<TFilters> & { page?: number }) => void;
  excelConfig?: ToolbarExcelConfig;
  pdfConfig?: ToolbarPdfConfig;
  columns?: import("@tanstack/react-table").ColumnDef<TData, unknown>[];
  totalRecords?: number;
  isLoading?: boolean;
  className?: string;
  onImport?: (params: {
    file: File;
    dryRun?: boolean;
  }) => Promise<ApiResponse<ExcelImportSummary>>;
  onImportSuccess?: () => void;
}
