"use client";

import { useMemo, useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { SubjectForm } from "./SubjectForm";
import { useSubjectsQuery } from "../hooks/queries";
import {
  useToggleSubjectMutation,
  useDeleteSubjectMutation,
  useImportSubjectsMutation,
} from "../hooks/mutations";
import { getSubjectColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { SubjectFilters, type Subject } from "../types";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  getSubjectFiltersConfig,
  subjectExcelConfig,
  subjectPdfConfig,
} from "../config/subjects-toolbar.config";
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";

export function SubjectsListClient() {
  // Filters, sorting, search from URL
  const {
    page,
    limit,
    search,
    active = "",
    gradeId = "",
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<SubjectFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active: active || undefined,
    gradeId: gradeId || undefined,
    sortBy,
    sortOrder,
  };

  const { data: gradesOptionsData, isLoading: gradesLoading } =
    useGradesOptionsQuery();
  const gradesOptions = useMemo(
    () => gradesOptionsData ?? [],
    [gradesOptionsData],
  );

  // Modal state & selected subject
  const {
    isOpen: isModalOpen,
    selectedItem: selectedSubject,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Subject>();

  // Data fetching
  const { data, isLoading } = useSubjectsQuery(queryParams);

  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Mutations
  const {
    mutate: toggleStatus,
    isPending: togglePending,
    variables: togglingId,
  } = useToggleSubjectMutation();
  const {
    mutateAsync: deleteSubject,
    isPending: deletePending,
    variables: deletingId,
  } = useDeleteSubjectMutation();
  const { mutateAsync: importSubjects } = useImportSubjectsMutation();

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    const res = await deleteSubject(subjectToDelete.id);
    if (res.success) {
      setSubjectToDelete(null);
    }
  };

  const columns = useMemo(
    () =>
      getSubjectColumns({
        onEdit: openEdit,
        onDelete: setSubjectToDelete,
        onToggleStatus: toggleStatus,
        togglingId: togglePending ? (togglingId ?? null) : null,
        deletingId: deletePending ? (deletingId ?? null) : null,
      }),
    [openEdit, toggleStatus, togglingId, togglePending, deletePending, deletingId],
  );

  const filtersConfig = useMemo(
    () => getSubjectFiltersConfig(gradesOptions, gradesLoading),
    [gradesOptions, gradesLoading],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header with Focused Title Icon */}
      <PageHeader
        title="المواد الدراسية"
        description="إدارة وتهيئة المواد والمناهج الدراسية التابعة للمركز التعليمي."
        icon={BookOpen}
        actionButton={{
          label: "مادة جديدة",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <TableToolbar
          searchPlaceholder="ابحث عن مادة دراسية..."
          filters={filtersConfig}
          filterValues={{ active, gradeId }}
          onFilterChange={updateQuery}
          excelConfig={subjectExcelConfig}
          pdfConfig={subjectPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importSubjects}
        />

        <SharedTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          meta={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي مواد دراسية."
        />
      </Card>

      {/* 3. Form Modal (Shared Form Logic) */}
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
          isGradesLoading={gradesLoading}
        />
      </SharedModal>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد حذف المادة الدراسية"
        description={`هل أنت متأكد من رغبتك في حذف المادة الدراسية "${subjectToDelete?.name}"؟ سيتم حذف جميع السجلات المرتبطة بها نهائياً.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isLoading={deletePending}
      />
    </div>
  );
}
