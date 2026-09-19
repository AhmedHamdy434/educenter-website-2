import { type NotificationLog } from "../types";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  DELIVERED: {
    label: "تم التسليم",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  SENT: {
    label: "تم الإرسال",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "قيد الإرسال",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  FAILED: {
    label: "فشل الإرسال",
    className: "bg-rose-50 text-rose-800 border-rose-200",
    icon: AlertCircle,
  },
};

export function getNotificationColumns() {
  return [
    {
      accessorKey: "recipient",
      header: "المستلم",
      cell: ({ row }: { row: { original: NotificationLog } }) => {
        const name = row.original.recipient || "مستلم غير مسمى";
        return (
          <div className="flex items-center gap-2.5 text-right">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary font-bold text-xs border border-border">
              <MessageSquare className="size-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-xs sm:text-sm">
                {name}
              </span>
              {row.original.recipientPhone && (
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1 dir-ltr">
                  <Phone className="size-3 text-muted-foreground/60" />
                  {row.original.recipientPhone}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "القناة / النوع",
      cell: ({ row }: { row: { original: NotificationLog } }) => {
        const type = row.original.type || row.original.channel || "WHATSAPP";
        return (
          <Badge
            variant="outline"
            className="font-mono text-xs py-0.5 bg-emerald-50 text-emerald-900 border-emerald-200 font-bold"
          >
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "content",
      header: "محتوى الرسالة",
      cell: ({ row }: { row: { original: NotificationLog } }) => {
        const text =
          row.original.content || row.original.message || row.original.title || "—";
        return (
          <span
            className="text-xs text-muted-foreground max-w-sm truncate block font-medium"
            title={text}
          >
            {text}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "حالة التسليم",
      cell: ({ row }: { row: { original: NotificationLog } }) => {
        const config =
          statusConfig[row.original.status?.toUpperCase()] || {
            label: row.original.status || "غير محدد",
            className: "bg-stone-100 text-stone-700 border-stone-200",
            icon: Clock,
          };
        const Icon = config.icon;

        return (
          <Badge
            variant="outline"
            className={`font-semibold text-xs py-1 gap-1 ${config.className}`}
          >
            <Icon className="size-3" />
            <span>{config.label}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "وقت الإرسال",
      cell: ({ row }: { row: { original: NotificationLog } }) => {
        const dateStr =
          row.original.sentAt || row.original.createdAt
            ? new Date(
                row.original.sentAt || row.original.createdAt
              ).toLocaleString("ar-EG", {
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
  ];
}
