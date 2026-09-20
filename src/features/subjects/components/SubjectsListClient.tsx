"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { SubjectForm } from "./SubjectForm";
import { useSubjectsQuery } from "../hooks/queries";
import { useToggleSubjectMutation } from "../hooks/mutations";
import { getSubjectColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { STATUSES } from "@/constants/dropdown-options";
import { type Subject } from "../types";
import { type ApiResponse } from "@/types";

interface SubjectFilters {
  active?: string;
  gradeId?: string;
}

interface SubjectsListClientProps {
  initialData: ApiResponse<Subject[]>;
  gradesOptions: { value: string; label: string }[];
}

export function SubjectsListClient({
  initialData,
  gradesOptions,
}: SubjectsListClientProps) {
  // Pagination, search, sort, and filter state
  const {
    page,
    limit,
    search,
    active,
    gradeId,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<SubjectFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active,
    gradeId,
    sortBy,
    sortOrder,
  };

  // Modal state & selected subject
  const {
    isOpen: isModalOpen,
    selectedItem: selectedSubject,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Subject>();

  // Data fetching
  const { data, isLoading } = useSubjectsQuery(queryParams, initialData);

  const subjects = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // Mutations
  const toggleMutation = useToggleSubjectMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const columns = useMemo(
    () =>
      getSubjectColumns({
        onEdit: openEdit,
        onToggleStatus: toggleStatus,
        togglingId,
      }),
    [openEdit, toggleStatus, togglingId],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="المواد الدراسية"
        description="إدارة وتهيئة المواد والمناهج الدراسية التابعة للمركز التعليمي."
        actionButton={{
          label: "مادة جديدة",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2"
          dir="rtl"
        >
          <TableSearch placeholder="ابحث عن مادة دراسية..." />
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              placeholder="المرحلة الدراسية"
              value={gradeId || ""}
              onChange={(val) =>
                updateQuery({
                  gradeId: val || undefined,
                  page: 1,
                })
              }
              options={gradesOptions}
              allOptionLabel="كل المراحل"
            />
            <FilterDropdown
              placeholder="فلترة حسب الحالة"
              value={active || ""}
              onChange={(val) =>
                updateQuery({
                  active: val || undefined,
                  page: 1,
                })
              }
              options={STATUSES}
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={subjects}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي مواد دراسية."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedSubject ? "تعديل المادة الدراسية" : "إضافة مادة دراسية جديدة"
        }
      >
        <SubjectForm
          isOpen={isModalOpen}
          onClose={closeModal}
          subject={selectedSubject}
          gradesOptions={gradesOptions}
        />
      </SharedModal>
    </div>
  );
}

