import { type Grade } from "../types";
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
      meta: {
        exportHeader: "الترتيب",
        exportValue: (row: Grade) => row.order,
      },
      cell: ({ row }: { row: { original: Grade } }) => (
        <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground border border-border">
          {row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "اسم المرحلة الدراسية",
      enableSorting: true,
      meta: {
        exportHeader: "اسم المرحلة الدراسية",
        exportValue: (row: Grade) => row.name,
      },
      cell: ({ row }: { row: { original: Grade } }) => (
        <span className="font-bold text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "الوصف",
      meta: {
        exportHeader: "الوصف",
        exportValue: (row: Grade) => row.description || "لا يوجد وصف",
      },
      cell: ({ row }: { row: { original: Grade } }) => (
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
      meta: {
        exportHeader: "الحالة",
        exportValue: (row: Grade) => (row.isActive ? "مفعّل" : "غير مفعّل"),
      },
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
