import { type AuditLog } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User as UserIcon } from "lucide-react";

interface ColumnsProps {
  onViewDetails: (log: AuditLog) => void;
}

export function getAuditLogColumns({ onViewDetails }: ColumnsProps) {
  return [
    {
      accessorKey: "user",
      header: "المنفذ",
      cell: ({ row }: { row: { original: AuditLog } }) => {
        const actorName =
          row.original.user?.fullName ||
          row.original.user?.email ||
          row.original.userId ||
          "النظام";
        const role = row.original.user?.role;

        return (
          <div className="flex items-center gap-2.5 text-right">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary font-bold text-xs border border-border">
              <UserIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-xs sm:text-sm">
                {actorName}
              </span>
              {role && (
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {role}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "نوع الإجراء",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <Badge
          variant="outline"
          className="font-mono text-xs py-0.5 bg-secondary/50 text-foreground border-border font-semibold"
        >
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "entity",
      header: "الكيان المستهدف",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {row.original.entity || "—"}
        </span>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "عنوان IP",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <span className="font-mono text-xs text-muted-foreground block dir-ltr">
          {row.original.ipAddress || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ العملية",
      cell: ({ row }: { row: { original: AuditLog } }) => {
        const dateStr = row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleString("ar-EG", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
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
      id: "actions",
      header: "التفاصيل",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <Button
          onClick={() => onViewDetails(row.original)}
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-border text-foreground hover:bg-muted text-xs font-semibold gap-1"
        >
          <Eye className="size-3.5 text-primary" />
          <span>عرض</span>
        </Button>
      ),
    },
  ];
}
