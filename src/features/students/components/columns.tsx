import { type Student } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link2 } from "lucide-react";

interface ColumnsProps {
  onEdit: (student: Student) => void;
  onViewPayments: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  onGenerateParentLink?: (student: Student) => void;
  togglingId: string | null;
}

export function getStudentColumns({
  onEdit,
  onViewPayments,
  onToggleStatus,
  onGenerateParentLink,
  togglingId,
}: ColumnsProps) {
  return [
    {
      accessorKey: "user.fullName",
      header: "الطالب",
      cell: ({ row }: { row: { original: Student } }) => (
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
      cell: ({ row }: { row: { original: Student } }) => {
        const activeEnrollment = row.original.enrollments?.find((e) => e.isActive);
        return (
          <span className="font-bold text-primary bg-secondary px-2.5 py-1 rounded-md text-xs border border-border">
            {activeEnrollment?.grade.name || "غير مسجل"}
          </span>
        );
      },
    },
    {
      accessorKey: "user.phone",
      header: "الهاتف",
      cell: ({ row }: { row: { original: Student } }) => (
        <span className="text-muted-foreground font-mono text-xs block" dir="ltr">
          {row.original.user.phone}
        </span>
      ),
    },
    {
      accessorKey: "parentPhone",
      header: "هاتف ولي الأمر",
      cell: ({ row }: { row: { original: Student } }) => (
        <span className="text-muted-foreground font-mono text-xs block" dir="ltr">
          {row.original.parentPhone}
        </span>
      ),
    },
    {
      accessorKey: "notes",
      header: "ملاحظات",
      cell: ({ row }: { row: { original: Student } }) => (
        <span
          className="text-muted-foreground max-w-xs truncate block text-xs"
          title={row.original.notes || ""}
        >
          {row.original.notes || "لا توجد ملاحظات"}
        </span>
      ),
    },
    {
      accessorKey: "user.isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Student } }) => (
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
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="flex gap-1.5 justify-center items-center">
          <Button
            onClick={() => onEdit(row.original)}
            variant="brandOutline"
            size="sm"
            className="h-8 rounded-lg font-semibold text-xs px-2.5"
          >
            تعديل
          </Button>
          <Button
            onClick={() => onViewPayments(row.original)}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-border text-foreground hover:bg-muted font-medium text-xs px-2.5"
          >
            المدفوعات
          </Button>
          {onGenerateParentLink && (
            <Button
              onClick={() => onGenerateParentLink(row.original)}
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-border text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 font-semibold text-xs px-2.5 gap-1"
              title="توليد رابط ولي الأمر"
            >
              <Link2 className="size-3.5" />
              <span>ولي الأمر</span>
            </Button>
          )}
        </div>
      ),
    },
  ];
}
