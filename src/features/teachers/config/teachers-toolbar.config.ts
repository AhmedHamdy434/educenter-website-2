import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";
import { type SelectOption } from "@/components/common/form-select";

export function getTeacherFiltersConfig(
  subjectsOptions: SelectOption[] = [],
  subjectsLoading?: boolean,
): FilterConfig<"active" | "subjectId">[] {
  return [
    {
      key: "subjectId",
      type: "select",
      label: "المادة الدراسية",
      placeholder: "اختر المادة",
      allOptionLabel: "كل المواد",
      options: subjectsOptions,
      isLoading: subjectsLoading,
    },
    {
      key: "active",
      type: "select",
      label: "حالة المدرس",
      placeholder: "اختر الحالة",
      allOptionLabel: "جميع الحالات",
      options: STATUSES,
    },
  ];
}

export const teacherExcelConfig: ToolbarExcelConfig = {
  exportEndpoint: "/teachers/export/excel",
  templateEndpoint: "/teachers/export/template",
  fileName: "المدرسون.xlsx",
};

export const teacherPdfConfig: ToolbarPdfConfig = {
  exportEndpoint: "/teachers/export/pdf",
  fileName: "المدرسون.pdf",
};
