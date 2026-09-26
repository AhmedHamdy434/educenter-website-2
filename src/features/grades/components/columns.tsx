import { type Grade } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
}: ColumnsProps) {
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
      id: "subjectsCount",
      accessorKey: "_count.subjects",
      header: "عدد المواد",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">{row.original._count?.subjects ?? "-"}</Badge>
      ),
    },
    {
      id: "groupsCount",
      accessorKey: "_count.groups",
      header: "عدد المجموعات",
      enableSorting: true,
      cell: ({ row }: { row: { original: Grade } }) => (
        <Badge variant="subtle">{row.original._count?.groups ?? "-"}</Badge>
      ),
    },
    {
      id: "studentsCount",
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
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(row.original)}
            variant="brandOutline"
            size="sm"
            className="h-8 rounded-lg font-semibold"
          >
            تعديل
          </Button>
          <Button
            onClick={() => onDelete(row.original)}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive hover:text-destructive cursor-pointer"
            disabled={deletingId === row.original.id}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];
}
