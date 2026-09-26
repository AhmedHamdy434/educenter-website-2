import Link from "next/link";
import { type Group } from "../types";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface ColumnsProps {
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
  deletingId: string | null;
  centerSlug?: string;
}

export function getGroupColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
  deletingId,
  centerSlug,
}: ColumnsProps): ColumnDef<Group>[] {
  return [
    {
      accessorKey: "name",
      header: "المجموعة",
      enableSorting: true,
      cell: ({ row }: { row: { original: Group } }) => {
        const groupHref = centerSlug
          ? `/${centerSlug}/owner/groups/${row.original.id}`
          : `#`;
        return (
          <div className="flex flex-col text-right">
            <Link
              href={groupHref}
              className="font-bold text-primary hover:underline transition-colors"
            >
              {row.original.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {row.original.grade?.name || "غير محدد"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "subject.name",
      header: "المادة",
      cell: ({ row }: { row: { original: Group } }) => (
        <span className="font-semibold text-foreground">
          {row.original.subject?.name || "غير محدد"}
        </span>
      ),
    },
    {
      accessorKey: "teacher.user.fullName",
      header: "المعلم",
      cell: ({ row }: { row: { original: Group } }) => (
        <span className="text-muted-foreground font-medium text-sm">
          {row.original.teacher?.user?.fullName || "غير محدد"}
        </span>
      ),
    },
    {
      id: "studentsCount",
      header: "الطلاب / السعة",
      cell: ({ row }: { row: { original: Group } }) => {
        const enrolled = row.original._count?.students ?? 0;
        const capacity = row.original.capacity;
        return (
          <Badge variant="subtle" className="font-bold">
            {enrolled} {capacity ? `/ ${capacity}` : ""}
          </Badge>
        );
      },
    },
    {
      id: "schedule",
      header: "المواعيد الأسبوعية",
      cell: ({ row }: { row: { original: Group } }) => {
        const schedule = row.original.schedule || [];
        if (schedule.length === 0)
          return <span className="text-muted-foreground text-xs">غير محدد</span>;
        return (
          <div className="flex flex-wrap gap-1 max-w-xs justify-start">
            {schedule.map((item, idx) => (
              <span
                key={item.id || idx}
                className="inline-block bg-secondary border border-border rounded-md px-2 py-0.5 text-xs text-primary font-bold"
              >
                {DAY_NAMES_AR[item.day]} {formatTime(item.hour, item.minute)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Group } }) => (
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
      cell: ({ row }: { row: { original: Group } }) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(row.original)}
            variant="brandOutline"
            size="sm"
            className="h-8 rounded-lg"
          >
            تعديل
          </Button>
          <Button
            onClick={() => onDelete(row.original)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
            disabled={deletingId === row.original.id}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
