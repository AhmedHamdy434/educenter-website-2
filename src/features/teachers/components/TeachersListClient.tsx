"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { TeacherForm } from "./TeacherForm";
import { useTeachersQuery } from "../hooks/queries";
import {
  useToggleTeacherMutation,
  useDeleteTeacherMutation,
  useImportTeachersMutation,
} from "../hooks/mutations";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";
import { getTeacherColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type Teacher, type TeacherFilters } from "../types";
import {
  getTeacherFiltersConfig,
  teacherExcelConfig,
  teacherPdfConfig,
} from "../config/teachers-toolbar.config";

export function TeachersListClient() {
  // Pagination, search, sort, and filter state from URL
  const {
    page,
    limit,
    search,
    active = "",
    subjectId = "",
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
    active: active || undefined,
    subjectId: subjectId || undefined,
    sortBy,
    sortOrder,
  };

  // Subjects options query for dynamic updates & loading state
  const { data: fetchedSubjectsOptions, isLoading: isSubjectsLoading } =
    useSubjectsOptionsQuery();

  const subjectsOptions = useMemo(
    () => fetchedSubjectsOptions ?? [],
    [fetchedSubjectsOptions],
  );

  // Modal state & selected teacher
  const {
    isOpen: isModalOpen,
    selectedItem: selectedTeacher,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Teacher>();

  // Data fetching
  const { data, isLoading } = useTeachersQuery(queryParams);
  const teachers = useMemo(() => data?.data ?? [], [data?.data]);

  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  // Mutations
  const toggleMutation = useToggleTeacherMutation();
  const {
    mutateAsync: deleteTeacher,
    isPending: deletePending,
    variables: deletingId,
  } = useDeleteTeacherMutation();
  const { mutateAsync: importTeachers } = useImportTeachersMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    const res = await deleteTeacher(teacherToDelete.id);
    if (res.success) {
      setTeacherToDelete(null);
    }
  };

  const columns = useMemo(
    () =>
      getTeacherColumns({
        onEdit: openEdit,
        onDelete: setTeacherToDelete,
        onToggleStatus: toggleStatus,
        togglingId,
        deletingId: deletePending ? (deletingId ?? null) : null,
      }),
    [openEdit, toggleStatus, togglingId, deletePending, deletingId],
  );

  // Toolbar filters configuration
  const filtersConfig = useMemo(
    () => getTeacherFiltersConfig(subjectsOptions, isSubjectsLoading),
    [subjectsOptions, isSubjectsLoading],
  );

  const filterValues = useMemo(
    () => ({
      active,
      subjectId,
    }),
    [active, subjectId],
  );



  return (
    <div className="space-y-6 text-right" dir="rtl">
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

      {/* 2. Unified Toolbar & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <TableToolbar
          searchPlaceholder="ابحث عن مدرس..."
          filters={filtersConfig}
          filterValues={filterValues}
          onFilterChange={updateQuery}
          excelConfig={teacherExcelConfig}
          pdfConfig={teacherPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importTeachers}
        />

        <SharedTable
          columns={columns}
          data={teachers}
          isLoading={isLoading}
          meta={data?.meta}
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
          isSubjectsLoading={isSubjectsLoading}
        />
      </SharedModal>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد حذف المدرس"
        description={`هل أنت متأكد من رغبتك في حذف المدرس "${teacherToDelete?.user.fullName}"؟ سيتم حذف حسابه نهائياً.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isLoading={deletePending}
      />
    </div>
  );
}
