import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";
import { type SelectOption } from "@/components/common/form-select";

export function getStudentFiltersConfig(
  gradesOptions: SelectOption[] = [],
  gradesLoading?: boolean,
): FilterConfig<"active" | "gradeId">[] {
  return [
    {
      key: "gradeId",
      type: "select",
      label: "المرحلة الدراسية",
      placeholder: "اختر المرحلة",
      allOptionLabel: "كل المراحل",
      options: gradesOptions,
      isLoading: gradesLoading,
    },
    {
      key: "active",
      type: "select",
      label: "حالة الطالب",
      placeholder: "اختر الحالة",
      allOptionLabel: "جميع الحالات",
      options: STATUSES,
    },
  ];
}

export const studentExcelConfig: ToolbarExcelConfig = {
  exportEndpoint: "/students/export/excel",
  templateEndpoint: "/students/export/template",
  fileName: "الطلاب.xlsx",
};

export const studentPdfConfig: ToolbarPdfConfig = {
  exportEndpoint: "/students/export/pdf",
  fileName: "الطلاب.pdf",
};
