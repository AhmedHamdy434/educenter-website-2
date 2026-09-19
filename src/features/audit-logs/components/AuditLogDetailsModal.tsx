"use client";

import { SharedModal } from "@/components/common/SharedModal";
import { type AuditLog } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, User as UserIcon, Activity } from "lucide-react";

interface AuditLogDetailsModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailsModal({
  log,
  isOpen,
  onClose,
}: AuditLogDetailsModalProps) {
  if (!log) return null;

  const actorDisplay =
    log.user?.fullName || log.user?.email || log.userId || "النظام";

  const formattedDate = log.createdAt
    ? new Date(log.createdAt).toLocaleString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const detailsFormatted =
    typeof log.details === "object" && log.details !== null
      ? JSON.stringify(log.details, null, 2)
      : typeof log.details === "string"
      ? log.details
      : "لا توجد تفاصيل إضافية";

  return (
    <SharedModal isOpen={isOpen} onClose={onClose} title="تفاصيل العملية المسجلة">
      <div className="space-y-5 text-right" dir="rtl">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-muted/30 p-4 rounded-xl border border-border">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <UserIcon className="size-3.5 text-primary" />
              المنفذ:
            </span>
            <span className="font-bold text-sm text-foreground block truncate">
              {actorDisplay}
            </span>
            {log.user?.role && (
              <Badge variant="outline" className="text-[10px] py-0 bg-secondary border-border font-bold">
                {log.user.role}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Activity className="size-3.5 text-accent" />
              نوع الإجراء:
            </span>
            <span className="font-mono text-xs font-bold text-foreground bg-card px-2 py-1 rounded border border-border inline-block">
              {log.action}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Globe className="size-3.5 text-muted-foreground" />
              عنوان IP:
            </span>
            <span className="font-mono text-xs text-muted-foreground dir-ltr block">
              {log.ipAddress || "—"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="size-3.5 text-muted-foreground" />
              تاريخ ووقت التنفيذ:
            </span>
            <span className="text-xs text-muted-foreground font-medium block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* JSON Details Payload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">
            بيانات وسجل العملية (Payload Details):
          </label>
          <pre className="max-h-60 overflow-auto rounded-lg border border-border bg-[#182622] p-4 text-xs font-mono text-amber-200 dir-ltr text-left">
            {detailsFormatted}
          </pre>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="outline" className="rounded-lg font-semibold text-xs px-6">
            إغلاق
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}
