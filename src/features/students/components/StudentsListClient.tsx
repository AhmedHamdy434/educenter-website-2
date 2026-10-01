"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { StudentForm } from "./StudentForm";
import { StudentPaymentsModal } from "./StudentPaymentsModal";
import { ParentLinkModal } from "./ParentLinkModal";
import { useStudentsQuery } from "../hooks/queries";
import {
  useToggleStudentMutation,
  useDeleteStudentMutation,
  useImportStudentsMutation,
} from "../hooks/mutations";
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";
import { getStudentColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type Student, type StudentFilters } from "../types";
import {
  getStudentFiltersConfig,
  studentExcelConfig,
  studentPdfConfig,
} from "../config/students-toolbar.config";

export function StudentsListClient() {
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [paymentHistoryStudent, setPaymentHistoryStudent] =
    useState<Student | null>(null);
  const [magicLinkStudent, setMagicLinkStudent] = useState<Student | null>(
    null,
  );

  // Pagination, search, sort, and filter state from URL
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
  } = useTableFilters<StudentFilters>();

  const queryParams = {
    page,
    limit,
    search,
    active: active || undefined,
    gradeId: gradeId || undefined,
    sortBy,
    sortOrder,
  };

  // Grades options query for dynamic updates & loading state
  const { data: gradesOptions, isLoading: isGradesLoading } =
    useGradesOptionsQuery();

  // Modal state & selected student
  const {
    isOpen: isModalOpen,
    selectedItem: selectedStudent,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Student>();

  // Data fetching
  const { data, isLoading } = useStudentsQuery(queryParams);

  // Mutations
  const toggleMutation = useToggleStudentMutation();
  const deleteMutation = useDeleteStudentMutation();
  const { mutateAsync: importStudents } = useImportStudentsMutation();

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    const res = await deleteMutation.mutateAsync(studentToDelete.id);
    if (res.success) {
      setStudentToDelete(null);
    }
  };

  const columns = useMemo(
    () =>
      getStudentColumns({
        onEdit: openEdit,
        onDelete: setStudentToDelete,
        onViewPayments: setPaymentHistoryStudent,
        onToggleStatus: toggleMutation.mutate,
        onGenerateParentLink: setMagicLinkStudent,
        togglingId: toggleMutation.isPending ? (toggleMutation.variables ?? null) : null,
        deletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
      }),
    [
      openEdit,
      toggleMutation.mutate,
      toggleMutation.isPending,
      toggleMutation.variables,
      deleteMutation.isPending,
      deleteMutation.variables,
    ],
  );

  // Toolbar filters configuration
  const filtersConfig = useMemo(
    () => getStudentFiltersConfig(gradesOptions, isGradesLoading),
    [gradesOptions, isGradesLoading],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="الطلاب"
        description="إدارة حسابات وبيانات الطلاب المسجلين بالمركز وتتبع تسجيلهم بالمراحل الدراسية."
        actionButton={{
          label: "طالب جديد",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      {/* 2. Unified Toolbar & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <TableToolbar
          searchPlaceholder="ابحث عن طالب..."
          filters={filtersConfig}
          filterValues={{ active, gradeId }}
          onFilterChange={updateQuery}
          excelConfig={studentExcelConfig}
          pdfConfig={studentPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importStudents}
        />

        <SharedTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          meta={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي طلاب."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
      >
        <StudentForm
          isOpen={isModalOpen}
          onClose={closeModal}
          student={selectedStudent}
          gradesOptions={gradesOptions ?? []}
          isGradesLoading={isGradesLoading}
        />
      </SharedModal>

      {/* 4. Payments History Modal */}
      {paymentHistoryStudent && (
        <StudentPaymentsModal
          isOpen={!!paymentHistoryStudent}
          onClose={() => setPaymentHistoryStudent(null)}
          studentId={paymentHistoryStudent.id}
          studentName={paymentHistoryStudent.user.fullName}
        />
      )}

      {/* 5. Parent Magic Link Modal */}
      <ParentLinkModal
        isOpen={!!magicLinkStudent}
        onClose={() => setMagicLinkStudent(null)}
        student={magicLinkStudent}
      />

      {/* 6. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد حذف الطالب"
        description={`هل أنت متأكد من رغبتك في حذف الطالب "${studentToDelete?.user.fullName}"؟ سيتم حذف جميع البيانات والاشتراكات المرتبطة به نهائياً.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
