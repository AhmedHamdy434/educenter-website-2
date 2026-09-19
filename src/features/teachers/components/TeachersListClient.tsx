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
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTeachersModal } from "../state/useTeachersModal";
import { type Teacher } from "../types";
import { type ApiResponse } from "@/types";

interface TeachersListClientProps {
  initialData: ApiResponse<Teacher[]>;
  subjectsOptions: { value: string; label: string }[];
}

export function TeachersListClient({ initialData, subjectsOptions }: TeachersListClientProps) {
  // Pagination, search, and filter state
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  // Modal state & selected teacher
  const {
    isOpen: isModalOpen,
    selectedTeacher,
    openCreate,
    openEdit,
    close: closeModal,
  } = useTeachersModal();

  // Data fetching
  const queryParams = useMemo(() => ({
    page: params.page,
    limit: params.limit,
    search: params.search,
    active: params.active,
    subjectId: params.subjectId || undefined,
  }), [params]);

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

      {/* 2. Filters & Table */}
      <Card className="space-y-4">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4"
          dir="rtl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <TableSearch
              placeholder="ابحث عن مدرس..."
              value={params.search}
              onChange={handleSearchChange}
            />
            <FilterDropdown
              placeholder="المادة الدراسية"
              value={params.subjectId || ""}
              onChange={(val) => handleFilterChange("subjectId", val)}
              options={subjectsOptions}
              allOptionLabel="كل المواد"
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
          data={teachers}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لم يتم العثور على أي مدرسين."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedTeacher ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"
        }
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
