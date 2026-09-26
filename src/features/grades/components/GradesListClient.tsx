"use client";

import { useMemo, useState } from "react";
import { Plus, Layers } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { GradeForm } from "./GradeForm";
import { useGradesQuery } from "../hooks/queries";
import {
  useToggleGradeMutation,
  useDeleteGradeMutation,
  useImportGradesMutation,
} from "../hooks/mutations";
import { getGradeColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { GradeFilters, type Grade } from "../types";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  gradeFiltersConfig,
  gradeExcelConfig,
  gradePdfConfig,
} from "../config/grades-toolbar.config";

export function GradesListClient() {
  const [gradeToDelete, setGradeToDelete] = useState<Grade | null>(null);

  const {
    page,
    limit,
    search,
    active = "",
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<GradeFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active,
    sortBy,
    sortOrder,
  };

  // Modal state & selected grade
  const {
    isOpen: isModalOpen,
    selectedItem: selectedGrade,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Grade>();

  // Data fetching
  const { data, isLoading } = useGradesQuery(queryParams);

  // Mutations
  const {
    mutate: toggleStatus,
    isPending: togglePending,
    variables: togglingId,
  } = useToggleGradeMutation();
  const {
    mutate: deleteGrade,
    isPending: deletePending,
    variables: deletingId,
  } = useDeleteGradeMutation();
  const { mutateAsync: importGrades } = useImportGradesMutation();

  const columns = useMemo(
    () =>
      getGradeColumns({
        onEdit: openEdit,
        onDelete: (grade) => setGradeToDelete(grade),
        onToggleStatus: toggleStatus,
        togglingId: togglePending ? togglingId : null,
        deletingId: deletePending ? deletingId : null,
      }),
    [openEdit, toggleStatus, togglingId, togglePending, deletingId, deletePending],
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
        <TableToolbar
          searchPlaceholder="ابحث عن مرحلة دراسية..."
          filters={gradeFiltersConfig}
          filterValues={{ active }}
          onFilterChange={updateQuery}
          excelConfig={gradeExcelConfig}
          pdfConfig={gradePdfConfig}
          columns={columns}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importGrades}
        />

        <SharedTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          meta={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
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

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!gradeToDelete}
        onClose={() => setGradeToDelete(null)}
        onConfirm={async () => {
          if (gradeToDelete) {
            deleteGrade(gradeToDelete.id);
            setGradeToDelete(null);
          }
        }}
        title="تأكيد حذف المرحلة الدراسية"
        description={`هل أنت متأكد من رغبتك في حذف المرحلة الدراسية "${gradeToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isLoading={deletingId === gradeToDelete?.id}
      />
    </div>
  );
}
