"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { GroupForm } from "./GroupForm";
import { useGroupsQuery } from "../hooks/queries";
import {
  useToggleGroupStatusMutation,
  useDeleteGroupMutation,
} from "../hooks/mutations";
import { getGroupColumns } from "./columns";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useGroupsModal } from "../state/useGroupsModal";
import { type Group } from "../types";
import { type ApiResponse } from "@/types";
import { type SelectOption } from "@/components/common/form-select";

interface GroupsListClientProps {
  initialData: ApiResponse<Group[]>;
  gradesOptions: SelectOption[];
  subjectsOptions: SelectOption[];
}

export function GroupsListClient({
  initialData,
  gradesOptions,
  subjectsOptions,
}: GroupsListClientProps) {
  // Pagination, search, and filter state
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  // Modal state & selected group
  const {
    isOpen: isModalOpen,
    selectedGroup,
    openCreate,
    openEdit,
    close: closeModal,
  } = useGroupsModal();

  // Data fetching
  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      search: params.search,
      active: params.active,
      gradeId: params.gradeId || undefined,
      subjectId: params.subjectId || undefined,
    }),
    [params],
  );

  const { data, isLoading } = useGroupsQuery(queryParams, initialData);

  const groups = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // Mutations
  const toggleMutation = useToggleGroupStatusMutation();
  const deleteMutation = useDeleteGroupMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const deletingId = deleteMutation.isPending
    ? (deleteMutation.variables ?? null)
    : null;

  const routeParams = useParams<{ centerSlug: string }>();
  const centerSlug = routeParams?.centerSlug;

  const toggleStatus = toggleMutation.mutate;
  const deleteGroup = deleteMutation.mutate;

  const columns = useMemo(
    () =>
      getGroupColumns({
        onEdit: openEdit,
        onDelete: deleteGroup,
        onToggleStatus: toggleStatus,
        togglingId,
        deletingId,
        centerSlug,
      }),
    [openEdit, deleteGroup, toggleStatus, togglingId, deletingId, centerSlug],
  );

  return (
    <div className="space-y-6 text-right">
      {/* 1. Header */}
      <PageHeader
        title="المجموعات الدراسية"
        description="إدارة المجموعات والحصص الدراسية الأسبوعية وتعيين المعلمين والمراحل الدراسية لها."
        actionButton={{
          label: "مجموعة جديدة",
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
              placeholder="ابحث عن مجموعة..."
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
                { label: "نشطة", value: "true" },
                { label: "معطلة", value: "false" },
              ]}
              allOptionLabel="الحالة (الكل)"
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={groups}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لم يتم العثور على أي مجموعات دراسية."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedGroup ? "تعديل المجموعة الدراسية" : "إضافة مجموعة جديدة"}
      >
        <GroupForm
          isOpen={isModalOpen}
          onClose={closeModal}
          group={selectedGroup}
          gradesOptions={gradesOptions}
        />
      </SharedModal>
    </div>
  );
}
