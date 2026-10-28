"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Link2, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type GroupEnrolledStudent } from "../../types";
import { type Student } from "@/features/students/types";

interface EnrolledStudentsColumnsOptions {
  page?: number;
  limit?: number;
  showRemoveButton?: boolean;
  onGenerateParentLink: (student: Student) => void;
  onViewPayments: (
    studentId: string,
    studentName: string,
    groupStudentId?: string,
  ) => void;
  onRemoveStudent: (studentId: string, studentName: string) => void;
}

export function getEnrolledStudentsColumns({
  page = 1,
  limit = 10,
  showRemoveButton = true,
  onGenerateParentLink,
  onViewPayments,
  onRemoveStudent,
}: EnrolledStudentsColumnsOptions): ColumnDef<GroupEnrolledStudent>[] {
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
      accessorFn: (row) => row.student?.user?.fullName ?? "",
      header: "اسم الطالب",
      enableSorting: true,
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-foreground text-sm">
              {student?.user?.fullName ?? "-"}
            </span>
            {student?.code && (
              <span className="text-[11px] font-mono text-muted-foreground/80">
                {student.code}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "phone",
      accessorFn: (row) => row.student?.user?.phone ?? "",
      header: "رقم الهاتف",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-mono">
          {row.original.student?.user?.phone || "-"}
        </span>
      ),
    },
    {
      id: "parentPhone",
      accessorFn: (row) => row.student?.parentPhone ?? "",
      header: "هاتف ولي الأمر",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-mono">
          {row.original.student?.parentPhone || "-"}
        </span>
      ),
    },
    {
      accessorKey: "joinedAt",
      id: "joinedAt",
      header: "تاريخ الانضمام",
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.joinedAt;
        return (
          <span className="text-muted-foreground text-xs font-medium">
            {date ? new Date(date).toLocaleDateString("ar-EG") : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "subscriptionStartDate",
      id: "subscriptionStartDate",
      header: "بداية الاشتراك",
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.subscriptionStartDate;
        return (
          <span className="text-muted-foreground text-xs font-medium">
            {date ? new Date(date).toLocaleDateString("ar-EG") : "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">الإجراءات</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onGenerateParentLink(item.student as unknown as Student)
              }
              className="h-8 gap-1 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg text-xs font-medium"
              title="توليد رابط تقرير ولي الأمر"
            >
              <Link2 className="size-3.5" />
              <span>ولي الأمر</span>
            </Button>

            <Button
              type="button"
              variant="brandOutline"
              size="sm"
              onClick={() =>
                onViewPayments(
                  item.student.id,
                  item.student.user.fullName,
                  item.id,
                )
              }
              className="h-8 gap-1.5 text-xs rounded-lg font-medium"
            >
              <CreditCard className="size-3.5 text-primary" />
              <span>سجل الدفع</span>
            </Button>

            {showRemoveButton && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onRemoveStudent(item.student.id, item.student.user.fullName)
                }
                className="h-8 gap-1 text-destructive hover:bg-destructive/10 rounded-lg text-xs font-medium"
              >
                <UserMinus className="size-3.5" />
                <span>إلغاء</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
