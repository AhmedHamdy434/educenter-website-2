"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, AlertCircle, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type GroupStudentPaymentInfo } from "../../types";

interface GroupPaymentsColumnsOptions {
  page?: number;
  limit?: number;
  activeMonth: string;
  onRecordPayment: (student: GroupStudentPaymentInfo) => void;
}

export function getGroupPaymentsColumns({
  page = 1,
  limit = 10,
  activeMonth,
  onRecordPayment,
}: GroupPaymentsColumnsOptions): ColumnDef<GroupStudentPaymentInfo>[] {
  return [
    {
      id: "index",
      header: "#",
      enableSorting: false,
      cell: ({ row }) => {
        const index = (page - 1) * limit + row.index + 1;
        return (
          <span className="font-semibold text-muted-foreground text-xs">
            {index}
          </span>
        );
      },
    },
    {
      id: "name",
      accessorFn: (row) => row.studentInfo?.fullName ?? "",
      header: "اسم الطالب",
      enableSorting: true,
      cell: ({ row }) => {
        const studentInfo = row.original.studentInfo;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-foreground text-sm">
              {studentInfo?.fullName ?? "—"}
            </span>
            <div className="flex items-center gap-2">
              {studentInfo?.code && (
                <span className="text-[11px] font-mono text-muted-foreground/80">
                  {studentInfo.code}
                </span>
              )}
              {studentInfo?.email && (
                <span className="text-[11px] text-muted-foreground truncate max-w-48">
                  {studentInfo.email}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "phone",
      accessorFn: (row) => row.studentInfo?.phone ?? "",
      header: "رقم الهاتف",
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className="font-mono text-xs text-muted-foreground"
          dir="ltr"
        >
          {row.original.studentInfo?.phone || "—"}
        </span>
      ),
    },
    {
      id: "subscriptionStartDate",
      accessorFn: (row) => row.subscriptionStartDate ?? "",
      header: "بداية الاشتراك",
      enableSorting: true,
      cell: ({ row }) => {
        const dateStr = row.original.subscriptionStartDate;
        return (
          <span className="text-xs text-muted-foreground">
            {dateStr ? new Date(dateStr).toLocaleDateString("ar-EG") : "—"}
          </span>
        );
      },
    },
    {
      id: "monthlyFee",
      accessorFn: (row) => row.monthlyFee,
      header: "الاشتراك الشهري",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-bold text-foreground text-xs">
          {Number(row.original.monthlyFee || 0).toFixed(2)} ج.م
        </span>
      ),
    },
    {
      id: "status",
      header: () => <div className="text-center">حالة الدفع</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        const normalizedTarget = activeMonth ? activeMonth.slice(0, 7) : "";
        const isRequired = item.currentMonth !== undefined
          ? item.currentMonth.isRequired
          : activeMonth
          ? !!item.requiredMonths?.some((m) => m.slice(0, 7) === normalizedTarget)
          : false;

        const isPaid = item.currentMonth !== undefined
          ? item.currentMonth.isPaid
          : activeMonth
          ? !!item.paidMonths?.some((p) => p.subscriptionDate.slice(0, 7) === normalizedTarget)
          : false;

        if (!activeMonth) {
          return <div className="text-center text-muted-foreground/40 text-xs">—</div>;
        }

        if (!isRequired) {
          return (
            <div className="flex justify-center">
              <Badge
                variant="subtle"
                className="bg-stone-100/80 text-stone-700 border-stone-300/80 text-xs font-bold"
              >
                غير مستحق
              </Badge>
            </div>
          );
        }

        if (isPaid) {
          return (
            <div className="flex justify-center">
              <Badge
                variant="subtle"
                className="bg-emerald-50/80 text-emerald-800 border-emerald-300/80 text-xs font-bold flex items-center gap-1"
              >
                <CheckCircle className="size-3" />
                <span>تم التحصيل</span>
              </Badge>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <Badge
              variant="subtle"
              className="bg-rose-50/80 text-rose-800 border-rose-300/80 text-xs font-bold flex items-center gap-1"
            >
              <AlertCircle className="size-3" />
              <span>غير مدفوع</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "notes",
      header: () => <div className="text-center">الملاحظات</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        const normalizedTarget = activeMonth ? activeMonth.slice(0, 7) : "";
        const paymentNotes = item.currentMonth !== undefined
          ? item.currentMonth.payment?.notes
          : activeMonth
          ? item.paidMonths?.find((p) => p.subscriptionDate.slice(0, 7) === normalizedTarget)?.notes
          : undefined;

        if (!activeMonth) {
          return <div className="text-center text-muted-foreground/40 text-xs">—</div>;
        }

        return (
          <div
            className="text-center text-xs text-muted-foreground max-w-36 truncate mx-auto"
            title={paymentNotes || ""}
          >
            {paymentNotes || "—"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">الإجراء</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        const normalizedTarget = activeMonth ? activeMonth.slice(0, 7) : "";
        const isRequired = item.currentMonth !== undefined
          ? item.currentMonth.isRequired
          : activeMonth
          ? !!item.requiredMonths?.some((m) => m.slice(0, 7) === normalizedTarget)
          : false;

        const isPaid = item.currentMonth !== undefined
          ? item.currentMonth.isPaid
          : activeMonth
          ? !!item.paidMonths?.some((p) => p.subscriptionDate.slice(0, 7) === normalizedTarget)
          : false;

        if (!activeMonth) {
          return <div className="text-center text-muted-foreground/40 text-xs">—</div>;
        }

        if (isRequired && !isPaid) {
          return (
            <div className="flex justify-center">
              <Button
                onClick={() => onRecordPayment(item)}
                disabled={!activeMonth}
                variant="brand"
                size="sm"
                className="h-8 px-3 rounded-lg text-xs flex items-center gap-1 font-bold shadow-none cursor-pointer"
              >
                <Landmark className="size-3.5" />
                <span>تسجيل الدفع</span>
              </Button>
            </div>
          );
        }

        return <div className="text-center text-muted-foreground/40 text-xs">—</div>;
      },
    },
  ];
}

