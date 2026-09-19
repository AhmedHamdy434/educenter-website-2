import { type AdminUser } from "../types";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Phone, Calendar } from "lucide-react";

export function getAdminColumns() {
  return [
    {
      accessorKey: "fullName",
      header: "الاسم والبريد الإلكتروني",
      cell: ({ row }: { row: { original: AdminUser } }) => (
        <div className="flex items-center gap-3 text-right">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary font-bold text-sm border border-border">
            {row.original.fullName
              ? row.original.fullName.charAt(0).toUpperCase()
              : "م"}
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
      accessorKey: "phone",
      header: "رقم الهاتف",
      cell: ({ row }: { row: { original: AdminUser } }) => (
        <div
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono"
          dir="ltr"
        >
          <Phone className="size-3 text-muted-foreground/60" />
          <span>{row.original.phone || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "الدور والصلاحية",
      cell: () => (
        <Badge
          variant="outline"
          className="bg-secondary/70 text-primary border-border font-bold text-xs gap-1 py-1"
        >
          <Shield className="size-3 text-accent" />
          <span>مدير مركز</span>
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ التعيين",
      cell: ({ row }: { row: { original: AdminUser } }) => {
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
      header: "الحالة",
      cell: ({ row }: { row: { original: AdminUser } }) => (
        <Badge
          variant="outline"
          className={
            row.original.isActive
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-stone-100 text-stone-600 border-stone-200"
          }
        >
          {row.original.isActive ? "نشط" : "معطل"}
        </Badge>
      ),
    },
  ];
}
