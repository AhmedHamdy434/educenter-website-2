import { type Grade } from "../types";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RowActions } from "@/components/common/RowActions";

interface ColumnsProps {
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function getGradeColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
  deletingId,
}: ColumnsProps): ColumnDef<Grade>[] {
  return [
    {
      accessorKey: "order",
      header: "الترتيب",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">{row.original.order}</Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "اسم المرحلة الدراسية",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <span className="font-bold text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }: { row: { original: Grade } }) => (
        <span
          className="text-muted-foreground max-w-xs truncate block text-xs"
          title={row.original.description || ""}
        >
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      id: "subjects",
      accessorKey: "_count.subjects",
      header: "عدد المواد",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">{row.original._count?.subjects ?? "-"}</Badge>
      ),
    },
    {
      id: "groups",
      accessorKey: "_count.groups",
      header: "عدد المجموعات",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">{row.original._count?.groups ?? "-"}</Badge>
      ),
    },
    {
      id: "enrollments",
      accessorKey: "_count.enrollments",
      header: "عدد الطلاب",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">
          {row.original._count?.enrollments ?? "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Grade } }) => (
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
      cell: ({ row }: { row: { original: Grade } }) => (
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
