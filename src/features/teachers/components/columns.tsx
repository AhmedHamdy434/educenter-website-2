import { type Teacher } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ColumnsProps {
  onEdit: (teacher: Teacher) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
}

export function getTeacherColumns({
  onEdit,
  onToggleStatus,
  togglingId,
}: ColumnsProps) {
  return [
    {
      accessorKey: "user.fullName",
      header: "المدرس",
      cell: ({ row }: { row: { original: Teacher } }) => (
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
      accessorKey: "specialization",
      header: "التخصص",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span className="font-semibold text-foreground">
          {row.original.specialization}
        </span>
      ),
    },
    {
      accessorKey: "user.phone",
      header: "الهاتف",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span className="text-muted-foreground font-mono text-xs block" dir="ltr">
          {row.original.user.phone}
        </span>
      ),
    },
    {
      accessorKey: "salary",
      header: "الراتب",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span className="font-bold text-foreground">
          {row.original.salary} ج.م
        </span>
      ),
    },
    {
      id: "subjects",
      header: "المواد الدراسية",
      cell: ({ row }: { row: { original: Teacher } }) => {
        const subjects = row.original.subjects || [];
        if (subjects.length === 0) return <span className="text-muted-foreground text-xs">لا توجد مواد</span>;
        return (
          <div className="flex flex-wrap gap-1 max-w-xs justify-start">
            {subjects.map((s) => (
              <span
                key={s.id}
                className="inline-block bg-secondary border border-border rounded-md px-2 py-0.5 text-xs text-primary font-bold"
              >
                {s.subject.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "user.isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Teacher } }) => (
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
      cell: ({ row }: { row: { original: Teacher } }) => (
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
