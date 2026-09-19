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
import { useTableFilters } from "@/hooks/useTableFilters";
import { useGradesModal } from "../state/useGradesModal";
import { type Grade } from "../types";
import { type ApiResponse } from "@/types";

interface GradesListClientProps {
  initialData: ApiResponse<Grade[]>;
}

export function GradesListClient({ initialData }: GradesListClientProps) {
  // Pagination, search, and filter state
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  // Modal state & selected grade
  const {
    isOpen: isModalOpen,
    selectedGrade,
    openCreate,
    openEdit,
    close: closeModal,
  } = useGradesModal();

  // Data fetching
  const { data, isLoading } = useGradesQuery(params, initialData);

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
          <TableSearch
            placeholder="ابحث عن مرحلة دراسية..."
            value={params.search}
            onChange={handleSearchChange}
          />
          <FilterDropdown
            placeholder="فلترة حسب الحالة"
            value={(params.active as unknown as string) || ""}
            onChange={(val) => handleFilterChange("active", val)}
            options={[
              { label: "نشط", value: "true" },
              { label: "معطل", value: "false" },
            ]}
          />
        </div>

        <SharedTable
          columns={columns}
          data={grades}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
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
