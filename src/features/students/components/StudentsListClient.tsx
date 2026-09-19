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
import { useTableFilters } from "@/hooks/useTableFilters";
import { useStudentsModal } from "../state/useStudentsModal";
import { type Student } from "../types";
import { type ApiResponse } from "@/types";

interface StudentsListClientProps {
  initialData: ApiResponse<Student[]>;
  gradesOptions: { value: string; label: string }[];
}

export function StudentsListClient({ initialData, gradesOptions }: StudentsListClientProps) {
  const [paymentHistoryStudent, setPaymentHistoryStudent] = useState<Student | null>(null);
  const [magicLinkStudent, setMagicLinkStudent] = useState<Student | null>(null);

  // Pagination, search, and filter state
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  // Modal state & selected student
  const {
    isOpen: isModalOpen,
    selectedStudent,
    openCreate,
    openEdit,
    close: closeModal,
  } = useStudentsModal();

  // Data fetching
  const queryParams = useMemo(() => ({
    page: params.page,
    limit: params.limit,
    search: params.search,
    active: params.active,
    gradeId: params.gradeId || undefined,
  }), [params]);

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
    <div className="space-y-6 text-right">
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

      {/* 2. Filters & Table */}
      <Card className="space-y-4">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4"
          dir="rtl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <TableSearch
              placeholder="ابحث عن طالب..."
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
              placeholder="فلترة حسب الحالة"
              value={(params.active as unknown as string) || ""}
              onChange={(val) => handleFilterChange("active", val)}
              options={[
                { label: "نشط", value: "true" },
                { label: "معطل", value: "false" },
              ]}
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={students}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لم يتم العثور على أي طلاب."
        />
      </Card>

      {/* 3. Form Modal */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"
        }
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
