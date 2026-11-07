"use client";

import React from "react";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "lucide-react";
import { useSettlementDetailsQuery } from "../hooks/queries";
import { SettlementStatusType } from "../types";

interface SettlementDetailsModalProps {
  settlementId: string | null;
  onClose: () => void;
}

const statusBadgeMap: Record<SettlementStatusType, { label: string; className: string }> = {
  COMPLETED: { label: "مكتملة ومصروفة", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  PENDING: { label: "معلقة (حجز)", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  CANCELLED: { label: "ملغاة", className: "bg-rose-500/10 text-rose-600 border-rose-500/30" },
};

const methodLabels: Record<string, string> = {
  CASH: "نقداً",
  BANK_TRANSFER: "تحويل بنكي",
  WALLET: "محفظة إلكترونية",
  POS: "بطاقة دفع / POS",
};

export function SettlementDetailsModal({
  settlementId,
  onClose,
}: SettlementDetailsModalProps) {
  const { data: details, isLoading } = useSettlementDetailsQuery(
    settlementId || "",
    !!settlementId,
  );

  if (!settlementId) return null;

  return (
    <SharedModal
      isOpen={!!settlementId}
      onClose={onClose}
      title={details ? `تفاصيل التسوية: ${details.settlementNumber}` : "تفاصيل التسوية"}
    >
      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          جاري تحميل تفاصيل التسوية...
        </div>
      ) : !details ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          لم يتم العثور على بيانات التسوية.
        </div>
      ) : (
        <div className="space-y-5 text-right">
          {/* Header Summary */}
          <div className="bg-secondary/40 p-4 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-primary" />
                <span className="font-extrabold text-foreground">{details.settlementNumber}</span>
              </div>
              <Badge
                variant="outline"
                className={statusBadgeMap[details.status]?.className || ""}
              >
                {statusBadgeMap[details.status]?.label || details.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-border/50">
              <div>
                <span className="text-muted-foreground block">المعلم</span>
                <span className="font-bold text-foreground">{details.teacher.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">مبلغ التسوية</span>
                <span className="font-extrabold text-primary text-sm">{details.amount.toLocaleString()} ج.م</span>
              </div>
              <div>
                <span className="text-muted-foreground block">طريقة الصرف</span>
                <span className="font-medium">{methodLabels[details.paymentMethod] || details.paymentMethod}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">تاريخ التسوية</span>
                <span className="font-medium">{new Date(details.settlementDate).toLocaleDateString("ar-EG")}</span>
              </div>
            </div>

            {details.referenceNumber && (
              <div className="text-xs pt-1">
                <span className="text-muted-foreground">رقم المرجع: </span>
                <span className="font-mono font-bold text-foreground">{details.referenceNumber}</span>
              </div>
            )}

            {details.cancellationReason && (
              <div className="text-xs p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600">
                <span className="font-bold">سبب الإلغاء: </span>
                {details.cancellationReason}
              </div>
            )}

            {details.notes && (
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">ملاحظات: </span>
                {details.notes}
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">
              بنود واشتراكات الطلاب المسواة ({details.items.length})
            </h4>
            <div className="max-h-56 overflow-y-auto border border-border rounded-xl">
              <Table dir="rtl">
                <TableHeader className="bg-secondary/30">
                  <TableRow className="text-xs">
                    <TableHead className="text-right">الطالب</TableHead>
                    <TableHead className="text-right">المجموعة / النشاط</TableHead>
                    <TableHead className="text-center">إيصال التحصيل</TableHead>
                    <TableHead className="text-center font-bold text-primary">المبلغ المسوى</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.items.map((it) => (
                    <TableRow key={it.id} className="text-xs">
                      <TableCell className="font-semibold">{it.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{it.groupName}</TableCell>
                      <TableCell className="text-center font-mono text-[11px]">
                        {it.receiptNumber || "-"}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">
                        {it.allocatedAmount.toLocaleString()} ج.م
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <ModalActions
            onCancel={onClose}
            cancelLabel="إغلاق"
            className="pt-2 border-t-0 mt-0"
            size="sm"
          />
        </div>
      )}
    </SharedModal>
  );
}
