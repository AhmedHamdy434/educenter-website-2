import {
  FilterConfig,
  ToolbarExcelConfig,
  ToolbarPdfConfig,
} from "@/types/table-toolbar";
import { STATUSES } from "@/constants/dropdown-options";
import { type SelectOption } from "@/components/common/form-select";

export function getTeacherFiltersConfig(
  gradesOptions: SelectOption[] = [],
  subjectsOptions: SelectOption[] = [],
  gradesLoading?: boolean,
  subjectsLoading?: boolean,
  isGradeSelected: boolean = false,
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
      placeholder: isGradeSelected ? "اختر المادة" : "اختر المرحلة أولاً",
      allOptionLabel: isGradeSelected ? "كل المواد" : "اختر المرحلة أولاً",
      options: isGradeSelected ? subjectsOptions : [],
      isLoading: subjectsLoading,
      disabled: !isGradeSelected,
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
