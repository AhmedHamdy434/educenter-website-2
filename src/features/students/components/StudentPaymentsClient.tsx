"use client";

import { Landmark, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { formatFullDate, formatMonthName } from "@/utils/time";

export function StudentPaymentsClient() {
  const { data: paymentsRes, isLoading } = useStudentPaymentsQuery("me");
  const payments = paymentsRes?.data || [];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Page Header */}
      <PageHeader
        title="سجل الاشتراكات والمدفوعات"
        description="استعراض تفاصيل وتاريخ الاشتراكات الشهرية والمدفوعات المسددة للمجموعات المسجل بها."
      />

      {/* Main Card Content */}
      <Card className="p-6 border-border bg-card shadow-none rounded-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-10 animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold">جاري تحميل سجل مدفوعاتك...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-secondary/60 border-b border-border text-foreground font-bold text-xs">
                  <th className="p-4">المجموعة الدراسية</th>
                  <th className="p-4">شهر الاشتراك</th>
                  <th className="p-4">المبلغ المدفوع</th>
                  <th className="p-4">تاريخ ووقت التحصيل</th>
                  <th className="p-4">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">{payment.group.name}</td>
                    <td className="p-4 font-bold text-primary">{formatMonthName(payment.subscriptionDate)}</td>
                    <td className="p-4 font-extrabold text-foreground">{payment.amount.toFixed(2)} ج.م</td>
                    <td className="p-4 font-mono text-muted-foreground text-xs" dir="ltr">
                      {formatFullDate(payment.paidAt)}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs" title={payment.notes || ""}>
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Landmark className="size-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-bold text-foreground">لا يوجد مدفوعات مسجلة بعد</p>
            <p className="text-xs text-muted-foreground mt-1">لم نجد أي اشتراكات مسددة مسجلة باسمك في النظام حالياً.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
