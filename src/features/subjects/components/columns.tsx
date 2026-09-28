import { type Subject } from "../types";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RowActions } from "@/components/common/RowActions";

interface ColumnsProps {
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function getSubjectColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
  deletingId,
}: ColumnsProps): ColumnDef<Subject>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }: { row: { index: number } }) => (
        <Badge variant="subtle">{row.index + 1}</Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "اسم المادة الدراسية",
      enableSorting: true,
      cell: ({ row }: { row: { original: Subject } }) => (
        <span className="font-semibold text-foreground">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "grade.name",
      header: "المرحلة الدراسية",
      cell: ({ row }: { row: { original: Subject } }) => (
        <span className="font-medium text-primary bg-secondary px-2.5 py-1 rounded-md text-xs border border-border">
          {row.original.grade?.name || "غير محددة"}
        </span>
      ),
    },
    {
      id: "groups",
      accessorKey: "_count.groups",
      header: "عدد المجموعات",
      enableSorting: true,
      cell: ({ row }: { row: { original: Subject } }) => (
        <Badge variant="subtle">{row.original._count?.groups ?? "-"}</Badge>
      ),
    },
    {
      id: "teachers",
      accessorKey: "_count.teacherSubjects",
      header: "عدد المعلمين",
      enableSorting: true,
      cell: ({ row }: { row: { original: Subject } }) => (
        <Badge variant="subtle">
          {row.original._count?.teacherSubjects ?? "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }: { row: { original: Subject } }) => (
        <span
          className="text-muted-foreground max-w-xs truncate block text-xs"
          title={row.original.description || ""}
        >
          {row.original.description || "لا يوجد وصف"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Subject } }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => onToggleStatus(row.original.id)}
          disabled={togglingId === row.original.id}
          aria-label="تغيير حالة التفعيل"
        />
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }: { row: { original: Subject } }) => (
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
