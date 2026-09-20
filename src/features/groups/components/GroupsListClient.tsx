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
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { STATUSES } from "@/constants/dropdown-options";
import { type Group } from "../types";
import { type ApiResponse } from "@/types";
import { type SelectOption } from "@/components/common/form-select";

interface GroupFilters {
  active?: string;
  gradeId?: string;
  subjectId?: string;
}

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
  // Pagination, search, sort, and filter state
  const {
    page,
    limit,
    search,
    active,
    gradeId,
    subjectId,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<GroupFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active,
    gradeId,
    subjectId,
    sortBy,
    sortOrder,
  };

  // Modal state & selected group
  const {
    isOpen: isModalOpen,
    selectedItem: selectedGroup,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Group>();

  // Data fetching
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
    <div className="space-y-6 text-right" dir="rtl">
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

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2"
          dir="rtl"
        >
          <TableSearch placeholder="ابحث عن مجموعة..." />
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
          data={groups}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          sorting={sorting}
          onSortingChange={onSortingChange}
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

