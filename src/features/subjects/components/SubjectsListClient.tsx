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
import { useTableFilters } from "@/hooks/useTableFilters";
import { useSubjectsModal } from "../state/useSubjectsModal";
import { type Subject } from "../types";
import { type ApiResponse } from "@/types";

interface SubjectsListClientProps {
  initialData: ApiResponse<Subject[]>;
  gradesOptions: { value: string; label: string }[];
}

export function SubjectsListClient({ initialData, gradesOptions }: SubjectsListClientProps) {
  // Pagination, search, and filter state
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  // Modal state & selected subject
  const {
    isOpen: isModalOpen,
    selectedSubject,
    openCreate,
    openEdit,
    close: closeModal,
  } = useSubjectsModal();

  // Data fetching (only including relevant keys for backend GET /subjects params)
  const queryParams = useMemo(() => ({
    page: params.page,
    limit: params.limit,
    search: params.search,
    active: params.active,
    gradeId: params.gradeId || undefined,
  }), [params]);

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
    <div className="space-y-6 text-right">
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

      {/* 2. Filters & Table */}
      <Card className="space-y-4">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4"
          dir="rtl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <TableSearch
              placeholder="ابحث عن مادة دراسية..."
              value={params.search}
              onChange={handleSearchChange}
            />
            <FilterDropdown
              placeholder="المرحلة الدراسية"
              value={params.gradeId || ""}
              onChange={(val) => handleFilterChange("gradeId", val)}
              options={gradesOptions}
              allOptionLabel="كل المراحل"
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
        </div>

        <SharedTable
          columns={columns}
          data={subjects}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
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
