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
import { Wallet, AlertCircle } from "lucide-react";
import { TeacherFinancialRow } from "../types";

interface TeacherFinancialsTableProps {
  teachers: TeacherFinancialRow[];
  onOpenSettlement: (teacher: TeacherFinancialRow) => void;
}

export function TeacherFinancialsTable({
  teachers,
  onOpenSettlement,
}: TeacherFinancialsTableProps) {
  if (teachers.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <AlertCircle className="size-8 mx-auto text-muted-foreground/60 mb-2" />
        <p className="text-muted-foreground font-medium text-sm">
          لا يوجد معلمون مسجلون أو لم يتم العثور على نتائج مطابقة للبحث.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <Table dir="rtl">
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-right font-bold">المعلم</TableHead>
            <TableHead className="text-center font-bold">إجمالي المستحقات</TableHead>
            <TableHead className="text-center font-bold">خصم الاسترداد</TableHead>
            <TableHead className="text-center font-bold">صافي المستحقات</TableHead>
            <TableHead className="text-center font-bold">المنصرف فعلياً</TableHead>
            <TableHead className="text-center font-bold">محجوز (معلق)</TableHead>
            <TableHead className="text-center font-bold text-primary">المتاح للصرف</TableHead>
            <TableHead className="text-center font-bold">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => {
            const hasAvailable = teacher.availablePayableBalance > 0;

            return (
              <TableRow key={teacher.teacherId} className="hover:bg-secondary/20">
                <TableCell className="font-semibold text-right">
                  <div>
                    <div className="text-foreground font-bold">{teacher.name}</div>
                    {teacher.phone && (
                      <div className="text-xs text-muted-foreground">{teacher.phone}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {teacher.grossEarnings.toLocaleString()} ج.م
                </TableCell>
                <TableCell className="text-center font-medium text-rose-600">
                  {teacher.refundAdjustments > 0
                    ? `-${teacher.refundAdjustments.toLocaleString()} ج.م`
                    : "0 ج.م"}
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {teacher.netEarnings.toLocaleString()} ج.م
                </TableCell>
                <TableCell className="text-center font-medium text-emerald-600">
                  {teacher.settledAmount.toLocaleString()} ج.م
                </TableCell>
                <TableCell className="text-center font-medium">
                  {teacher.pendingAmount > 0 ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                      {teacher.pendingAmount.toLocaleString()} ج.م
                    </Badge>
                  ) : (
                    "0 ج.م"
                  )}
                </TableCell>
                <TableCell className="text-center font-extrabold text-primary text-base">
                  {teacher.availablePayableBalance.toLocaleString()} ج.م
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant={hasAvailable ? "default" : "secondary"}
                    disabled={!hasAvailable}
                    onClick={() => onOpenSettlement(teacher)}
                    className="gap-1.5 font-bold"
                  >
                    <Wallet className="size-3.5" />
                    تسوية المستحقات
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

