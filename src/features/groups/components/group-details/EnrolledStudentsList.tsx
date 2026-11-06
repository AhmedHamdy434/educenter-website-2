"use client";

import { useState, useMemo, useCallback } from "react";
import { Users } from "lucide-react";
import { TableSearch } from "@/components/common/TableSearch";
import { SharedTable } from "@/components/common/SharedTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { StudentPaymentsModal } from "@/features/students/components/StudentPaymentsModal";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useGroupStudentsQuery } from "../../hooks/queries";
import { useRemoveStudentsFromGroupMutation } from "../../hooks/mutations";
import { getEnrolledStudentsColumns } from "./enrolled-students-columns";
import { type GroupStudentsQueryParams } from "../../types";

interface EnrolledStudentsListProps {
  groupId: string;
  showRemoveButton?: boolean;
}

export function EnrolledStudentsList({
  groupId,
  showRemoveButton = true,
}: EnrolledStudentsListProps) {
  const { page, limit, search, sortBy, sortOrder, sorting, onSortingChange } =
    useTableFilters();

  const queryParams: GroupStudentsQueryParams = {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  };

  // 3. استعلام جلب الطلاب المسجلين بالصفحة الحالية من الباك إند
  const {
    data: groupStudentsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupStudentsQuery(groupId, queryParams);


  // 5. حالات المودالات المحلية
  const [selectedStudentForRemove, setSelectedStudentForRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [paymentHistoryStudent, setPaymentHistoryStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 6. طفرة إزالة طالب من المجموعة
  const { mutateAsync: removeStudent, isPending: isRemovePending } =
    useRemoveStudentsFromGroupMutation();

  const handleConfirmRemove = async () => {
    if (selectedStudentForRemove) {
      await removeStudent({
        id: groupId,
        studentIds: [selectedStudentForRemove.id],
      });
      setSelectedStudentForRemove(null);
    }
  };

  const handleViewPayments = useCallback(
    (studentId: string, studentName: string) => {
      setPaymentHistoryStudent({
        id: studentId,
        name: studentName,
      });
    },
    [],
  );

  const handleOpenRemoveDialog = useCallback(
    (studentId: string, studentName: string) => {
      setSelectedStudentForRemove({ id: studentId, name: studentName });
    },
    [],
  );

  // 7. تعريف الأعمدة واستقرار المراجع
  const columns = useMemo(
    () =>
      getEnrolledStudentsColumns({
        page,
        limit,
        showRemoveButton,
        onViewPayments: handleViewPayments,
        onRemoveStudent: handleOpenRemoveDialog,
      }),
    [
      page,
      limit,
      showRemoveButton,
      handleViewPayments,
      handleOpenRemoveDialog,
    ],
  );
 

  return (
    <>
      <div className="space-y-4">
        {/* شريط البحث وإجمالي عدد الطلاب */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h2 className="font-bold text-foreground text-base">
              قائمة الطلاب المسجلين ({groupStudentsResponse?.meta?.total})
            </h2>
          </div>

          <div className="w-full sm:w-72">
            <TableSearch placeholder="ابحث بالاسم أو رقم الهاتف..." />
          </div>
        </div>

        {/* الجدول الموحد مع الترتيب والتصفح وحالة التحميل */}
        <SharedTable
          columns={columns}
          data={groupStudentsResponse?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          meta={groupStudentsResponse?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyTitle={
            search
              ? "لا يوجد طلاب يطابقون معايير البحث"
              : "لم يتم تسجيل أي طلاب في هذه المجموعة بعد"
          }
          emptyDescription={
            search
              ? "تأكد من كتابة الاسم أو رقم الهاتف بشكل صحيح، أو أعد ضبط معايير البحث."
              : "يمكنك إضافة وقيد الطلاب في هذه المجموعة للبدء في متابعة حضورهم واشتراكاتهم."
          }
          emptyIcon={Users}
        />

        {/* حوار تأكيد إلغاء تسجيل الطالب */}
        {selectedStudentForRemove && (
          <ConfirmDialog
            isOpen={!!selectedStudentForRemove}
            onClose={() => setSelectedStudentForRemove(null)}
            onConfirm={handleConfirmRemove}
            title="إلغاء تسجيل الطالب من المجموعة"
            description={`هل أنت متأكد من إلغاء تسجيل الطالب "${selectedStudentForRemove.name}" من هذه المجموعة الدراسية؟`}
            confirmLabel="نعم، إلغاء التسجيل"
            cancelLabel="تراجع"
            isLoading={isRemovePending}
          />
        )}
      </div>

      {/* مودال سجل مدفوعات واشتراكات الطالب */}
      {paymentHistoryStudent && (
        <StudentPaymentsModal
          isOpen={!!paymentHistoryStudent}
          onClose={() => setPaymentHistoryStudent(null)}
          studentId={paymentHistoryStudent.id}
          studentName={paymentHistoryStudent.name}
          groupId={groupId}
        />
      )}
    </>
  );
}
