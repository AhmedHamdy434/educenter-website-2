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
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";
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
    gradeId = "",
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
    gradeId: gradeId || undefined,
    subjectId: subjectId || undefined,
    sortBy,
    sortOrder,
  };

  const isGradeSelected = Boolean(gradeId);

  // Options queries
  const { data: gradesOptions, isLoading: isGradesLoading } = useGradesOptionsQuery();
  const { data: fetchedSubjectsOptions, isLoading: isSubjectsLoading } =
    useSubjectsOptionsQuery(gradeId || undefined, isGradeSelected);

  // Modal state & selected teacher
  const {
    isOpen: isModalOpen,
    selectedItem: selectedTeacher,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Teacher>();


  // Data fetching & mutations
  const { data, isLoading } = useTeachersQuery(queryParams);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const toggleMutation = useToggleTeacherMutation();
  const { mutateAsync: deleteTeacher, isPending: deletePending, variables: deletingId } =
    useDeleteTeacherMutation();
  const { mutateAsync: importTeachers } = useImportTeachersMutation();

  const togglingId = toggleMutation.isPending ? (toggleMutation.variables ?? null) : null;

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    const res = await deleteTeacher(teacherToDelete.id);
    if (res.success) setTeacherToDelete(null);
  };

  // Cascading reset: changing gradeId also clears subjectId
  const handleFilterChange = (updates: Partial<TeacherFilters> & { page?: number }) => {
    if ("gradeId" in updates && updates.gradeId !== gradeId) {
      updates.subjectId = undefined;
    }
    updateQuery(updates);
  };

  const columns = useMemo(
    () =>
      getTeacherColumns({
        onEdit: openEdit,
        onDelete: setTeacherToDelete,
        onToggleStatus: toggleMutation.mutate,
        togglingId,
        deletingId: deletePending ? (deletingId ?? null) : null,
      }),
    [openEdit, toggleMutation.mutate, togglingId, deletePending, deletingId],
  );

  const filtersConfig = useMemo(
    () =>
      getTeacherFiltersConfig(
        gradesOptions ?? [],
        isGradeSelected ? (fetchedSubjectsOptions ?? []) : [],
        isGradesLoading,
        isSubjectsLoading,
        isGradeSelected,
      ),
    [gradesOptions, fetchedSubjectsOptions, isGradesLoading, isSubjectsLoading, isGradeSelected],
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
          filterValues={{ active, gradeId, subjectId }}
          onFilterChange={handleFilterChange}
          excelConfig={teacherExcelConfig}
          pdfConfig={teacherPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importTeachers}
        />

        <SharedTable
          columns={columns}
          data={data?.data ?? []}
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
          gradesOptions={gradesOptions ?? []}
          isGradesLoading={isGradesLoading}
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
