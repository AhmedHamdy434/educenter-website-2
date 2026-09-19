import { type UserListItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone, Calendar } from "lucide-react";

interface ColumnsProps {
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  togglingId: string | null;
}

const roleLabels: Record<string, { label: string; className: string }> = {
  OWNER: {
    label: "مالك المركز",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  TEACHER: {
    label: "معلم",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  STUDENT: {
    label: "طالب",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

export function getUserColumns({ onToggleStatus, togglingId }: ColumnsProps) {
  return [
    {
      accessorKey: "fullName",
      header: "المستخدم",
      cell: ({ row }: { row: { original: UserListItem } }) => (
        <div className="flex items-center gap-3 text-right">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary font-bold text-sm border border-border">
            {row.original.fullName ? row.original.fullName.charAt(0).toUpperCase() : "م"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm">
              {row.original.fullName}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <Mail className="size-3 text-muted-foreground/60" />
              {row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "نوع الحساب (الدور)",
      cell: ({ row }: { row: { original: UserListItem } }) => {
        const roleInfo = roleLabels[row.original.role] || {
          label: row.original.role,
          className: "bg-stone-100 text-stone-700 border-stone-200",
        };
        return (
          <Badge
            variant="outline"
            className={`font-bold text-xs py-1 ${roleInfo.className}`}
          >
            {roleInfo.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "رقم الهاتف",
      cell: ({ row }: { row: { original: UserListItem } }) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono" dir="ltr">
          <Phone className="size-3 text-muted-foreground/60" />
          <span>{row.original.phone || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإنشاء",
      cell: ({ row }: { row: { original: UserListItem } }) => {
        const dateStr = row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—";
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Calendar className="size-3 text-muted-foreground/60" />
            <span>{dateStr}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "حالة التفعيل",
      cell: ({ row }: { row: { original: UserListItem } }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.isActive}
            onCheckedChange={() =>
              onToggleStatus(row.original.id, row.original.isActive)
            }
            disabled={
              togglingId === row.original.id || row.original.role === "OWNER"
            }
            aria-label="تغيير حالة التفعيل"
          />
          <span
            className={`text-xs font-semibold ${
              row.original.isActive ? "text-emerald-700" : "text-muted-foreground"
            }`}
          >
            {row.original.isActive ? "نشط" : "معطل"}
          </span>
        </div>
      ),
    },
  ];
}
