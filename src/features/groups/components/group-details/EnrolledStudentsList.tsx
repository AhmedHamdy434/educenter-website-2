"use client";

import { useState, useMemo, useCallback } from "react";
import { Users } from "lucide-react";
import { TableSearch } from "@/components/common/TableSearch";
import { SharedTable } from "@/components/common/SharedTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ParentLinkModal } from "@/features/students/components/ParentLinkModal";
import { StudentPaymentsModal } from "@/features/students/components/StudentPaymentsModal";
import { type Student } from "@/features/students/types";
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
  const { data: groupStudentsResponse, isLoading } = useGroupStudentsQuery(
    groupId,
    queryParams,
  );


  // 5. حالات المودالات المحلية
  const [magicLinkStudent, setMagicLinkStudent] = useState<Student | null>(
    null,
  );
  const [selectedStudentForRemove, setSelectedStudentForRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [paymentHistoryStudent, setPaymentHistoryStudent] = useState<{
    id: string;
    name: string;
    groupStudentId?: string;
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
    (studentId: string, studentName: string, groupStudentId?: string) => {
      setPaymentHistoryStudent({
        id: studentId,
        name: studentName,
        groupStudentId,
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

  const handleOpenParentLink = useCallback((student: Student) => {
    setMagicLinkStudent(student);
  }, []);

  // 7. تعريف الأعمدة واستقرار المراجع
  const columns = useMemo(
    () =>
      getEnrolledStudentsColumns({
        page,
        limit,
        showRemoveButton,
        onGenerateParentLink: handleOpenParentLink,
        onViewPayments: handleViewPayments,
        onRemoveStudent: handleOpenRemoveDialog,
      }),
    [
      page,
      limit,
      showRemoveButton,
      handleOpenParentLink,
      handleViewPayments,
      handleOpenRemoveDialog,
    ],
  );

  const totalCount = groupStudentsResponse?.meta?.total ?? 0;
  const studentsList = useMemo(
    () => groupStudentsResponse?.data ?? [],
    [groupStudentsResponse?.data],
  );

  return (
    <>
      <div className="space-y-4 text-right" dir="rtl">
        {/* شريط البحث وإجمالي عدد الطلاب */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h2 className="font-bold text-foreground text-base">
              قائمة الطلاب المسجلين ({totalCount})
            </h2>
          </div>

          <div className="w-full sm:w-72">
            <TableSearch placeholder="ابحث بالاسم أو رقم الهاتف..." />
          </div>
        </div>

        {/* الجدول الموحد مع الترتيب والتصفح وحالة التحميل */}
        <SharedTable
          columns={columns}
          data={studentsList}
          isLoading={isLoading}
          meta={groupStudentsResponse?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage={
            search
              ? "لا يوجد طلاب يطابقون معايير البحث."
              : "لم يتم تسجيل أي طلاب في هذه المجموعة بعد."
          }
        />

        {/* مودال رابط ولي الأمر السحري */}
        <ParentLinkModal
          isOpen={!!magicLinkStudent}
          onClose={() => setMagicLinkStudent(null)}
          student={magicLinkStudent}
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
          groupStudentId={paymentHistoryStudent.groupStudentId}
        />
      )}
    </>
  );
}
