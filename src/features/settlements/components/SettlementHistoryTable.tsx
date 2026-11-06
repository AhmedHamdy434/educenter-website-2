"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { SettlementRecord, SettlementStatusType } from "../types";

interface SettlementHistoryTableProps {
  settlements: SettlementRecord[];
  onViewDetails: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (settlement: SettlementRecord) => void;
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

export function SettlementHistoryTable({
  settlements,
  onViewDetails,
  onComplete,
  onCancel,
}: SettlementHistoryTableProps) {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <AlertCircle className="size-8 mx-auto text-muted-foreground/60 mb-2" />
        <p className="text-muted-foreground font-medium text-sm">
          لا توجد سجلات تسويات مسجلة حتى الآن.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <Table dir="rtl">
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-right font-bold">رقم التسوية</TableHead>
            <TableHead className="text-right font-bold">المعلم</TableHead>
            <TableHead className="text-center font-bold">المبلغ</TableHead>
            <TableHead className="text-center font-bold">الحالة</TableHead>
            <TableHead className="text-center font-bold">طريقة الصرف</TableHead>
            <TableHead className="text-center font-bold">التاريخ</TableHead>
            <TableHead className="text-center font-bold">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.map((item) => {
            const isPending = item.status === "PENDING";

            return (
              <TableRow key={item.id} className="hover:bg-secondary/20">
                <TableCell className="font-mono text-xs font-bold">
                  {item.settlementNumber}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <span className="font-bold text-foreground">{item.teacherName}</span>
                    {item.teacherPhone && (
                      <span className="block text-[11px] text-muted-foreground">
                        {item.teacherPhone}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center font-extrabold text-foreground text-sm">
                  {item.amount.toLocaleString()} ج.م
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={statusBadgeMap[item.status]?.className || ""}
                  >
                    {statusBadgeMap[item.status]?.label || item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-xs font-medium">
                  {methodLabels[item.paymentMethod] || item.paymentMethod}
                </TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">
                  {new Date(item.settlementDate).toLocaleDateString("ar-EG")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDetails(item.id)}
                      className="h-8 px-2 text-xs gap-1"
                    >
                      <Eye className="size-3.5" />
                      عرض
                    </Button>

                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onComplete(item.id)}
                          className="h-8 px-2 text-xs gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-50"
                        >
                          <CheckCircle className="size-3.5" />
                          تأكيد الصرف
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onCancel(item)}
                          className="h-8 px-2 text-xs gap-1 text-rose-600 hover:bg-rose-50"
                        >
                          <XCircle className="size-3.5" />
                          إلغاء
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

