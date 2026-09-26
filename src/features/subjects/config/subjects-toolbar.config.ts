import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";

export function getSubjectFiltersConfig(
  gradesOptions: { value: string; label: string }[] = [],
): FilterConfig<"active" | "gradeId">[] {
  return [
    {
      key: "gradeId",
      type: "select",
      label: "المرحلة الدراسية",
      placeholder: "اختر المرحلة",
      allOptionLabel: "كل المراحل",
      options: gradesOptions,
    },
    {
      key: "active",
      type: "select",
      label: "حالة المادة",
      placeholder: "اختر الحالة",
      allOptionLabel: "جميع الحالات",
      options: STATUSES,
    },
  ];
}

export const subjectExcelConfig: ToolbarExcelConfig = {
  exportEndpoint: "/subjects/export/excel",
  templateEndpoint: "/subjects/export/template",
  fileName: "المواد-الدراسية.xlsx",
};

export const subjectPdfConfig: ToolbarPdfConfig = {
  exportEndpoint: "/subjects/export/pdf",
  fileName: "المواد-الدراسية.pdf",
};
