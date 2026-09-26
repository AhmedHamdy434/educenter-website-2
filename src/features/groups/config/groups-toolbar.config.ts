import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";
import { type SelectOption } from "@/components/common/form-select";

export function getGroupFiltersConfig(
  gradesOptions: SelectOption[] = [],
  subjectsOptions: SelectOption[] = [],
  gradesLoading?: boolean,
  subjectsLoading?: boolean,
): FilterConfig<"active" | "gradeId" | "subjectId">[] {
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
      label: "حالة المجموعة",
      placeholder: "اختر الحالة",
      allOptionLabel: "جميع الحالات",
      options: STATUSES,
    },
  ];
}

export const groupExcelConfig: ToolbarExcelConfig = {
  exportEndpoint: "/groups/export/excel",
  templateEndpoint: "/groups/export/template",
  fileName: "المجموعات-الدراسية.xlsx",
};

export const groupPdfConfig: ToolbarPdfConfig = {
  exportEndpoint: "/groups/export/pdf",
  fileName: "المجموعات-الدراسية.pdf",
};
