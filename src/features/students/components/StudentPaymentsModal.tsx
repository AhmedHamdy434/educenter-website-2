"use client";

import { useMemo } from "react";
import { SharedModal } from "@/components/common/SharedModal";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { StudentPaymentForm } from "./StudentPaymentForm";
import { StudentPaymentsTable } from "./StudentPaymentsTable";

interface StudentPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  groupId?: string;
}

export function StudentPaymentsModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  groupId,
}: StudentPaymentsModalProps) {
  const {
    data: paymentsRes,
    isLoading: isPaymentsLoading,
    isError,
    error,
    refetch,
  } = useStudentPaymentsQuery(studentId, groupId, isOpen);

  const summary = paymentsRes?.data;
  const payments = useMemo(() => summary?.payments ?? [], [summary?.payments]);

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        groupId
          ? `مدفوعات واشتراك الطالب في هذه المجموعة: ${studentName}`
          : `سجل مدفوعات واشتراك الطالب: ${studentName}`
      }
    >
      <div className="space-y-5 min-w-0 w-full">
        {/* 1. نموذج التحصيل */}
        {summary && (
          <StudentPaymentForm summary={summary} isOpen={isOpen} />
        )}

        {/* 2. سجل المدفوعات */}
        <StudentPaymentsTable
          payments={payments}
          groupId={groupId}
          isLoading={isPaymentsLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
        />
      </div>
    </SharedModal>
  );
}
