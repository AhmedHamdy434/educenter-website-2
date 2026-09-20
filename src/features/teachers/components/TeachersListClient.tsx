"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { TeacherForm } from "./TeacherForm";
import { useTeachersQuery } from "../hooks/queries";
import { useToggleTeacherMutation } from "../hooks/mutations";
import { getTeacherColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { STATUSES } from "@/constants/dropdown-options";
import { type Teacher } from "../types";
import { type ApiResponse } from "@/types";

interface TeacherFilters {
  active?: string;
  subjectId?: string;
}

interface TeachersListClientProps {
  initialData: ApiResponse<Teacher[]>;
  subjectsOptions: { value: string; label: string }[];
}

export function TeachersListClient({
  initialData,
  subjectsOptions,
}: TeachersListClientProps) {
  // Pagination, search, sort, and filter state
  const {
    page,
    limit,
    search,
    active,
    subjectId,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<TeacherFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active,
    subjectId,
    sortBy,
    sortOrder,
  };

  // Modal state & selected teacher
  const {
    isOpen: isModalOpen,
    selectedItem: selectedTeacher,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Teacher>();

  // Data fetching
  const { data, isLoading } = useTeachersQuery(queryParams, initialData);

  const teachers = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // Mutations
  const toggleMutation = useToggleTeacherMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const columns = useMemo(
    () =>
      getTeacherColumns({
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
        title="المدرسون"
        description="إدارة حسابات وبيانات معلمي المركز التعليمي والمواد الموكلة إليهم."
        actionButton={{
          label: "مدرس جديد",
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
          <TableSearch placeholder="ابحث عن مدرس..." />
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              placeholder="المادة الدراسية"
              value={subjectId || ""}
              onChange={(val) =>
                updateQuery({
                  subjectId: val || undefined,
                  page: 1,
                })
              }
              options={subjectsOptions}
              allOptionLabel="كل المواد"
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
          data={teachers}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي مدرسين."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedTeacher ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"}
      >
        <TeacherForm
          isOpen={isModalOpen}
          onClose={closeModal}
          teacher={selectedTeacher}
          subjectsOptions={subjectsOptions}
        />
      </SharedModal>
    </div>
  );
}

