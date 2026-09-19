import { type Grade } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ColumnsProps {
  onEdit: (grade: Grade) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
}

export function getGradeColumns({
  onEdit,
  onToggleStatus,
  togglingId,
}: ColumnsProps) {
  return [
    {
      accessorKey: "order",
      header: "الترتيب",
      cell: ({ row }: { row: { original: Grade } }) => (
        <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground border border-border">
          {row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "اسم المرحلة الدراسية",
      cell: ({ row }: { row: { original: Grade } }) => (
        <span className="font-bold text-foreground">
          {row.original.name}
        </span>
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
          {row.original.description || "لا يوجد وصف"}
        </span>
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
        <Button
          onClick={() => onEdit(row.original)}
          variant="brandOutline"
          size="sm"
          className="h-8 rounded-lg font-semibold"
        >
          تعديل
        </Button>
      ),
    },
  ];
}
