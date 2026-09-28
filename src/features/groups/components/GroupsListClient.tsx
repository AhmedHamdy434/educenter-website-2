"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { GroupForm } from "./GroupForm";
import { useGroupsQuery } from "../hooks/queries";
import {
  useToggleGroupStatusMutation,
  useDeleteGroupMutation,
  useImportGroupsMutation,
} from "../hooks/mutations";
import { getGroupColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type Group, type GroupFilters } from "../types";
import {
  getGroupFiltersConfig,
  groupExcelConfig,
  groupPdfConfig,
} from "../config/groups-toolbar.config";
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";

export function GroupsListClient() {
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  // Pagination, search, sort, and filter state from URL
  const {
    page,
    limit,
    search,
    active = "",
    gradeId = "",
    subjectId = "",
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
    active: active || undefined,
    gradeId: gradeId || undefined,
    subjectId: subjectId || undefined,
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
  const { data, isLoading } = useGroupsQuery(queryParams);
  const { data: gradesOptions, isLoading: gradesLoading } =
    useGradesOptionsQuery();

  const { data: subjectsOptions, isLoading: subjectsLoading } =
    useSubjectsOptionsQuery();

  // Mutations
  const {
    mutate: toggleStatus,
    isPending: togglePending,
    variables: togglingId,
  } = useToggleGroupStatusMutation();

  const {
    mutateAsync: deleteGroup,
    isPending: deletePending,
    variables: deletingId,
  } = useDeleteGroupMutation();

  const { mutateAsync: importGroups } = useImportGroupsMutation();

  const routeParams = useParams<{ centerSlug: string }>();
  const centerSlug = routeParams?.centerSlug;

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    const res = await deleteGroup(groupToDelete.id);
    if (res.success) {
      setGroupToDelete(null);
    }
  };

  const columns = useMemo(
    () =>
      getGroupColumns({
        onEdit: openEdit,
        onDelete: setGroupToDelete,
        onToggleStatus: toggleStatus,
        togglingId: togglePending ? (togglingId ?? null) : null,
        deletingId: deletePending ? (deletingId ?? null) : null,
        centerSlug,
      }),
    [
      openEdit,
      toggleStatus,
      togglingId,
      togglePending,
      deletingId,
      deletePending,
      centerSlug,
    ],
  );

  const filtersConfig = useMemo(
    () => getGroupFiltersConfig(gradesOptions, subjectsOptions, gradesLoading,subjectsLoading),
    [gradesLoading, gradesOptions, subjectsLoading, subjectsOptions],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="المجموعات الدراسية"
        description="إدارة المجموعات والحصص الدراسية الأسبوعية وتعيين المعلمين والمراحل الدراسية لها."
        icon={Users}
        actionButton={{
          label: "مجموعة جديدة",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <TableToolbar
          searchPlaceholder="ابحث عن مجموعة..."
          filters={filtersConfig}
          filterValues={{ active, gradeId, subjectId }}
          onFilterChange={updateQuery}
          excelConfig={groupExcelConfig}
          pdfConfig={groupPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importGroups}
        />

        <SharedTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          meta={data?.meta}
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
          gradesOptions={gradesOptions ?? []}
        />
      </SharedModal>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!groupToDelete}
        onClose={() => setGroupToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="حذف المجموعة الدراسية"
        description={`هل أنت متأكد من حذف المجموعة الدراسية "${groupToDelete?.name}"؟ سيتم حذف جميع السجلات المرتبطة بها نهائياً.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isLoading={deletePending}
      />
    </div>
  );
}
