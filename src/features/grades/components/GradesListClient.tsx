"use client";

import { useMemo } from "react";
import { Plus, Layers } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { GradeForm } from "./GradeForm";
import { useGradesQuery } from "../hooks/queries";
import { useToggleGradeMutation } from "../hooks/mutations";
import { getGradeColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { type Grade } from "../types";
import { useTableFilters } from "@/hooks/useTableFilters";
import { STATUSES } from "@/constants/dropdown-options";

interface GradeFilters {
  active?: string;
}

export function GradesListClient() {
  const {
    page,
    limit,
    search,
    active,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<GradeFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active,
    sortBy,
    sortOrder,
  };

  // Modal state & selected grade
  const {
    isOpen: isModalOpen,
    selectedItem: selectedGrade,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Grade>();

  // Data fetching
  const { data, isLoading } = useGradesQuery(queryParams);

  const grades = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // Mutations
  const toggleMutation = useToggleGradeMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const columns = useMemo(
    () =>
      getGradeColumns({
        onEdit: openEdit,
        onToggleStatus: toggleStatus,
        togglingId,
      }),
    [openEdit, toggleStatus, togglingId],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header with Focused Title Icon */}
      <PageHeader
        title="المراحل الدراسية"
        description="إدارة وتهيئة المراحل الدراسية والصفوف التابعة للمركز التعليمي."
        icon={Layers}
        actionButton={{
          label: "مرحلة جديدة",
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
          <TableSearch placeholder="ابحث عن مرحلة دراسية..." />
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

        <SharedTable
          columns={columns}
          data={grades}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي مراحل دراسية."
        />
      </Card>

      {/* 3. Form Modal (Shared Form Logic) */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedGrade ? "تعديل المرحلة الدراسية" : "إضافة مرحلة دراسية جديدة"
        }
      >
        <GradeForm
          isOpen={isModalOpen}
          onClose={closeModal}
          grade={selectedGrade}
        />
      </SharedModal>
    </div>
  );
}
