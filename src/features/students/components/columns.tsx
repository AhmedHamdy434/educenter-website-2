import { ColumnDef } from "@tanstack/react-table";
import { type Student } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/common/RowActions";
import { Link2 } from "lucide-react";

interface ColumnsProps {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onViewPayments: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  onGenerateParentLink?: (student: Student) => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function getStudentColumns({
  onEdit,
  onDelete,
  onViewPayments,
  onToggleStatus,
  onGenerateParentLink,
  togglingId,
  deletingId,
}: ColumnsProps): ColumnDef<Student>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: "كود الطالب",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="subtle" className="font-mono text-xs font-semibold">
          {row.original.code || "—"}
        </Badge>
      ),
    },
    {
      id: "name",
      accessorKey: "user.fullName",
      header: "الطالب",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col text-right">
          <span className="font-bold text-foreground">
            {row.original.user.fullName}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.user.email}
          </span>
        </div>
      ),
    },
    {
      id: "grade",
      header: "المرحلة الدراسية",
      enableSorting: true,
      cell: ({ row }) => {
        const activeEnrollment = row.original.enrollments?.find(
          (e) => e.isActive,
        );
        return (
          <Badge variant="subtle" className="text-primary font-bold">
            {activeEnrollment?.grade.name || "غير مسجل"}
          </Badge>
        );
      },
    },
    {
      id: "phone",
      accessorKey: "user.phone",
      header: "الهاتف",
      cell: ({ row }) => (
        <span
          className="text-muted-foreground font-mono text-xs block"
          dir="ltr"
        >
          {row.original.user.phone}
        </span>
      ),
    },
    {
      id: "parentPhone",
      accessorKey: "parentPhone",
      header: "هاتف ولي الأمر",
      cell: ({ row }) => (
        <span
          className="text-muted-foreground font-mono text-xs block"
          dir="ltr"
        >
          {row.original.parentPhone}
        </span>
      ),
    },
    {
      id: "notes",
      accessorKey: "notes",
      header: "ملاحظات",
      cell: ({ row }) => (
        <span
          className="text-muted-foreground max-w-xs truncate block text-xs"
          title={row.original.notes || ""}
        >
          {row.original.notes || "لا توجد ملاحظات"}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "user.isActive",
      header: "الحالة",
      cell: ({ row }) => (
        <Switch
          checked={row.original.user.isActive}
          onCheckedChange={() => onToggleStatus(row.original.id)}
          disabled={togglingId === row.original.id}
          aria-label="تغيير حالة التفعيل"
        />
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => (
        <div className="flex gap-1.5 justify-center items-center">
          <Button
            onClick={() => onViewPayments(row.original)}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-border text-foreground hover:bg-muted font-medium text-xs px-2.5 cursor-pointer"
          >
            المدفوعات
          </Button>
          {onGenerateParentLink && (
            <Button
              onClick={() => onGenerateParentLink(row.original)}
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-border text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 font-semibold text-xs px-2.5 gap-1 cursor-pointer"
              title="توليد رابط ولي الأمر"
            >
              <Link2 className="size-3.5" />
              <span>ولي الأمر</span>
            </Button>
          )}
          <RowActions
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
            isDeleting={deletingId === row.original.id}
            deleteVariant="button"
          />
        </div>
      ),
    },
  ];
}
