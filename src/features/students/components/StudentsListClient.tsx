"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";
import { StudentForm } from "./StudentForm";
import { StudentPaymentsModal } from "./StudentPaymentsModal";
import { ParentLinkModal } from "./ParentLinkModal";
import { useStudentsQuery } from "../hooks/queries";
import { useToggleStudentMutation } from "../hooks/mutations";
import { getStudentColumns } from "./columns";
import { useCrudModal } from "@/hooks/useCrudModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { STATUSES } from "@/constants/dropdown-options";
import { type Student } from "../types";
import { type ApiResponse } from "@/types";

interface StudentFilters {
  active?: string;
  gradeId?: string;
}

interface StudentsListClientProps {
  initialData: ApiResponse<Student[]>;
  gradesOptions: { value: string; label: string }[];
}

export function StudentsListClient({
  initialData,
  gradesOptions,
}: StudentsListClientProps) {
  const [paymentHistoryStudent, setPaymentHistoryStudent] =
    useState<Student | null>(null);
  const [magicLinkStudent, setMagicLinkStudent] = useState<Student | null>(
    null,
  );

  // Pagination, search, sort, and filter state
  const {
    page,
    limit,
    search,
    active,
    gradeId,
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
    active,
    gradeId,
    sortBy,
    sortOrder,
  };

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

  const students = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // Mutations
  const toggleMutation = useToggleStudentMutation();

  const togglingId = toggleMutation.isPending
    ? (toggleMutation.variables ?? null)
    : null;
  const toggleStatus = toggleMutation.mutate;

  const columns = useMemo(
    () =>
      getStudentColumns({
        onEdit: openEdit,
        onViewPayments: setPaymentHistoryStudent,
        onToggleStatus: toggleStatus,
        onGenerateParentLink: (student) => setMagicLinkStudent(student),
        togglingId,
      }),
    [openEdit, toggleStatus, togglingId],
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

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2"
          dir="rtl"
        >
          <TableSearch placeholder="ابحث عن طالب..." />
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
          data={students}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
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

