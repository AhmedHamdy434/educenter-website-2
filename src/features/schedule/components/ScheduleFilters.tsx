"use client";

import { Filter, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";
import { useTeachersQuery } from "@/features/teachers/hooks/queries";
import { useGroupsQuery } from "@/features/groups/hooks/queries";
import { AttendanceStatusFilter, ScheduleFilterState } from "../types";
import { AttendanceStatusFilterOptions } from "../constants";
import { toSelectOptions } from "@/utils/options";

interface ScheduleFiltersProps {
  filters: ScheduleFilterState;
  onFilterChange: (newFilters: Partial<ScheduleFilterState>) => void;
  onResetFilters: () => void;
}

export function ScheduleFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: ScheduleFiltersProps) {
  // 1. Fetch options
  const { data: gradesOptions, isLoading: isGradesLoading } =
    useGradesOptionsQuery();

  const { data: subjectsOptions, isLoading: isSubjectsLoading } =
    useSubjectsOptionsQuery(filters.gradeId);

  const { data: teachersResponse, isLoading: isTeachersLoading } =
    useTeachersQuery({ limit: 100 });
  const teachersOptions = toSelectOptions(
    teachersResponse?.data || [],
    "id",
    (teacher) => teacher.user?.fullName,
  );

  const { data: groupsResponse, isLoading: isGroupsLoading } = useGroupsQuery(
    {
      limit: 100,
      gradeId: filters.gradeId,
      subjectId: filters.subjectId,
      teacherId: filters.teacherId,
    },
    !!(filters.gradeId || filters.subjectId || filters.teacherId),
  );
  const groupsOptions = toSelectOptions(groupsResponse?.data || []);

  const hasActiveFilters =
    !!filters.teacherId ||
    !!filters.gradeId ||
    !!filters.subjectId ||
    !!filters.groupId ||
    filters.status !== "ALL" ||
    !!filters.extraOnly;

  return (
    <div
      className="p-4 bg-card border border-border rounded-2xl space-y-3 text-right shadow-none"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Filter className="size-3.5 text-primary" />
            <span>تصفية الحصص</span>
          </div>

          <button
            type="button"
            onClick={() => onFilterChange({ extraOnly: !filters.extraOnly })}
            className={cn(
              "h-7 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border",
              filters.extraOnly
                ? "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40",
            )}
          >
            <Sparkles className="size-3 text-amber-600" />
            <span>إضافية فقط</span>
          </button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="size-3" />
            <span>إعادة ضبط</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* المعلم */}
        <FilterDropdown
          label="المعلم"
          placeholder="كل المعلمين"
          options={teachersOptions}
          value={filters.teacherId || ""}
          onChange={(val) => onFilterChange({ teacherId: val || undefined })}
          isLoading={isTeachersLoading}
        />

        {/* المرحلة الدراسية */}
        <FilterDropdown
          label="المرحلة"
          placeholder="كل المراحل"
          options={gradesOptions || []}
          value={filters.gradeId || ""}
          onChange={(val) =>
            onFilterChange({
              gradeId: val || undefined,
              subjectId: undefined, // Reset subject when grade changes
              groupId: undefined,
            })
          }
          isLoading={isGradesLoading}
        />

        {/* المادة الدراسية */}
        <FilterDropdown
          label="المادة"
          placeholder={filters.gradeId ? "كل المواد" : "اختر المرحلة أولاً"}
          options={subjectsOptions || []}
          value={filters.subjectId || ""}
          onChange={(val) =>
            onFilterChange({
              subjectId: val || undefined,
              groupId: undefined,
            })
          }
          isLoading={isSubjectsLoading}
          disabled={!filters.gradeId}
        />

        {/* المجموعة الدراسية */}
        <FilterDropdown
          label="المجموعة"
          placeholder="كل المجموعات"
          options={groupsOptions}
          value={filters.groupId || ""}
          onChange={(val) => onFilterChange({ groupId: val || undefined })}
          isLoading={isGroupsLoading}
          disabled={!filters.subjectId && !filters.gradeId && !filters.teacherId}
        />

        {/* حالة الحضور (Client-side) */}
        <FilterDropdown
          label="حالة الحضور"
          placeholder="كل الحالات"
          options={AttendanceStatusFilterOptions}
          value={filters.status}
          onChange={(val) =>
            onFilterChange({ status: val as AttendanceStatusFilter })
          }
        />
      </div>
    </div>
  );
}
