import { ColumnDef } from "@tanstack/react-table";
import { type Teacher } from "../types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/common/RowActions";

interface ColumnsProps {
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function getTeacherColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
  deletingId,
}: ColumnsProps): ColumnDef<Teacher>[] {
  return [
    {
      id: "name",
      accessorKey: "user.fullName",
      header: "المدرس",
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
      id: "phone",
      accessorKey: "user.phone",
      header: "الهاتف",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs block" dir="ltr">
          {row.original.user.phone || "—"}
        </span>
      ),
    },
    {
      id: "subjects",
      header: "المواد الدراسية",
      cell: ({ row }) => {
        const subjects = row.original.subjects || [];
        if (subjects.length === 0) {
          return <span className="text-muted-foreground text-xs">لا توجد مواد</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs justify-start">
            {subjects.map((s) => (
              <Badge
                key={s.id}
                variant="subtle"
                className="text-primary font-bold text-xs"
              >
                {s.subject.name}
              </Badge>
            ))}
          </div>
        );
      },
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
        <RowActions
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
          isDeleting={deletingId === row.original.id}
          deleteVariant="button"
        />
      ),
    },
  ];
}
