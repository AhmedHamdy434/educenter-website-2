"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Landmark, Receipt, Undo2 } from "lucide-react";
import { SharedTable } from "@/components/common/SharedTable";
import { fmt, formatFullDate, formatMonthName } from "@/utils/time";
import { StudentPaymentHistoryItem } from "../types";
import { PaymentStatus } from "@/types";

interface StudentPaymentsTableProps {
  payments: StudentPaymentHistoryItem[];
  groupId?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function StudentPaymentsTable({
  payments,
  groupId,
  isLoading = false,
  isError = false,
  error,
  onRetry,
}: StudentPaymentsTableProps) {
  const columns = useMemo<ColumnDef<StudentPaymentHistoryItem>[]>(() => {
    return [
      {
        accessorKey: "receiptNumber",
        header: "رقم الإيصال",
        enableSorting: false,
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <Receipt className="size-3 shrink-0" />
              <span>{payment.receiptNumber}</span>
            </div>
          );
        },
      },
      ...(!groupId
        ? [
            {
              accessorKey: "groupName",
              header: "المجموعة الدراسية",
              enableSorting: false,
              cell: ({ row }) => (
                <span className="font-bold text-foreground">
                  {row.original.groupName}
                </span>
              ),
            } as ColumnDef<StudentPaymentHistoryItem>,
          ]
        : []),
      {
        accessorKey: "subscriptionDate",
        header: "شهر الاشتراك",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-bold text-primary">
            {formatMonthName(row.original.subscriptionDate)}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "المبلغ المدفوع",
        enableSorting: false,
        cell: ({ row }) => {
          const payment = row.original;
          const hasRefund = payment.refundedAmount > 0;
          const isRowFull = payment.status === PaymentStatus.PAID;

          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-foreground">
                {fmt(payment.amount)} ج.م
              </span>
              {hasRefund && (
                <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
                  <Undo2 className="size-3" />
                  مسترد {fmt(payment.refundedAmount)} ج.م 
                </span>
              )}
              {isRowFull ? (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  تم السداد ✓
                </span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  سداد جزئي 
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "paymentMethod",
        header: "طريقة الدفع",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.paymentMethod}
          </span>
        ),
      },
      {
        accessorKey: "paidAt",
        header: "تاريخ ووقت التحصيل",
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className="font-mono text-muted-foreground text-[10px]"
          >
            {formatFullDate(row.original.paidAt)}
          </span>
        ),
      },
      {
        accessorKey: "notes",
        header: "الملاحظات",
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className="text-muted-foreground truncate max-w-30 block"
            title={row.original.notes || ""}
          >
            {row.original.notes || "—"}
          </span>
        ),
      },
    ];
  }, [groupId]);

  return (
    <div className="space-y-2 min-w-0 w-full">
      <h3 className="font-bold text-foreground text-xs flex items-center gap-2">
        <Landmark className="size-3.5 text-muted-foreground" />
        <span>
          {groupId
            ? `سجل مدفوعات الطالب في هذه المجموعة (${payments.length})`
            : `سجل العمليات السابقة (${payments.length})`}
        </span>
      </h3>

      <SharedTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={onRetry}
        emptyTitle="لا توجد مدفوعات مسجلة"
        emptyDescription={
          groupId
            ? "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب في هذه المجموعة بعد."
            : "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب بعد."
        }
        emptyIcon={Landmark}
        hidePagination
      />
    </div>
  );
}

