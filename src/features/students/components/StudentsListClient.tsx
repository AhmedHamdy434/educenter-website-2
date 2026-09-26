"use client";

import { useMemo, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableToolbar } from "@/components/common/table-toolbar";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { StudentForm } from "./StudentForm";
import { StudentPaymentsModal } from "./StudentPaymentsModal";
import { ParentLinkModal } from "./ParentLinkModal";
import { useStudentsQuery } from "../hooks/queries";
import {
  useToggleStudentMutation,
  useImportStudentsMutation,
} from "../hooks/mutations";
import { useGradesOptionsQuery } from "@/features/grades/hooks/queries";
import { getStudentColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type Student, type StudentFilters } from "../types";
import { type ApiResponse } from "@/types";
import { type SelectOption } from "@/components/common/form-select";
import {
  getStudentFiltersConfig,
  studentExcelConfig,
  studentPdfConfig,
} from "../config/students-toolbar.config";

interface StudentsListClientProps {
  initialData: ApiResponse<Student[]>;
  gradesOptions?: SelectOption[];
}

export function StudentsListClient({
  initialData,
  gradesOptions: initialGradesOptions = [],
}: StudentsListClientProps) {
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
  const { data: fetchedGradesOptions, isLoading: isGradesLoading } =
    useGradesOptionsQuery();

  const gradesOptions = useMemo(() => {
    return fetchedGradesOptions && fetchedGradesOptions.length > 0
      ? fetchedGradesOptions
      : initialGradesOptions;
  }, [fetchedGradesOptions, initialGradesOptions]);

  // Modal state & selected student
  const {
    isOpen: isModalOpen,
    selectedItem: selectedStudent,
    openCreate,
    openEdit,
    close: closeModal,
  } = useCrudModal<Student>();

  // Data fetching
  const { data, isLoading } = useStudentsQuery(queryParams, initialData);
  const students = useMemo(() => data?.data ?? [], [data?.data]);

  // Mutations
  const toggleMutation = useToggleStudentMutation();
  const { mutateAsync: importStudents } = useImportStudentsMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const handleGenerateParentLink = useCallback((student: Student) => {
    setMagicLinkStudent(student);
  }, []);

  const columns = useMemo(
    () =>
      getStudentColumns({
        onEdit: openEdit,
        onViewPayments: setPaymentHistoryStudent,
        onToggleStatus: toggleStatus,
        onGenerateParentLink: handleGenerateParentLink,
        togglingId,
      }),
    [openEdit, toggleStatus, handleGenerateParentLink, togglingId],
  );

  // Toolbar filters configuration
  const filtersConfig = useMemo(
    () => getStudentFiltersConfig(gradesOptions, isGradesLoading),
    [gradesOptions, isGradesLoading],
  );

  const filterValues = useMemo(
    () => ({
      active,
      gradeId,
    }),
    [active, gradeId],
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
          filterValues={filterValues}
          onFilterChange={updateQuery}
          excelConfig={studentExcelConfig}
          pdfConfig={studentPdfConfig}
          totalRecords={data?.meta?.total ?? 0}
          isLoading={isLoading}
          onImport={importStudents}
        />

        <SharedTable
          columns={columns}
          data={students}
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
          gradesOptions={gradesOptions}
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
    </div>
  );
}
