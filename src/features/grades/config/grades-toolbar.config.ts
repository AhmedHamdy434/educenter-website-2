import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";

export function getGradeFiltersConfig(
  isLoading?: boolean,
): FilterConfig<"active">[] {
  return [
    {
      key: "active",
      type: "select",
      label: "حالة المرحلة",
      placeholder: "اختر الحالة",
      allOptionLabel: "جميع الحالات",
      options: STATUSES,
      isLoading,
    },
  ];
}

export const gradeFiltersConfig: FilterConfig<"active">[] = getGradeFiltersConfig();

export const gradeExcelConfig: ToolbarExcelConfig = {
  exportEndpoint: "/grades/export/excel",
  templateEndpoint: "/grades/export/template",
  fileName: "المراحل-الدراسية.xlsx",
};

export const gradePdfConfig: ToolbarPdfConfig = {
  exportEndpoint: "/grades/export/pdf",
  fileName: "المراحل-الدراسية.pdf",
};
