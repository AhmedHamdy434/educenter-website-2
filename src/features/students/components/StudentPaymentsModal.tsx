"use client";

import { useState, useMemo } from "react";
import { Landmark, Loader2, PlusCircle, CheckCircle, Calendar } from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { Button } from "@/components/ui/button";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { usePayGroupStudentMonthMutation } from "@/features/groups/hooks/mutations";
import { formatFullDate, formatMonthName } from "@/utils/time";

interface StudentPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  groupId?: string;
  groupStudentId?: string;
  monthlyFee?: number;
  startDate?: string;
  monthsCount?: number;
}

export function StudentPaymentsModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  groupId,
  groupStudentId,
  monthlyFee,
  startDate,
  monthsCount,
}: StudentPaymentsModalProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // 1. Fetch student payments history
  const { data: paymentsRes, isLoading } = useStudentPaymentsQuery(
    studentId,
    isOpen
  );
  const rawPayments = useMemo(() => paymentsRes?.data || [], [paymentsRes?.data]);

  // 2. Filter payments to only the current group if groupId is provided
  const payments = useMemo(() => {
    if (!groupId) return rawPayments;
    return rawPayments.filter((p) => p.group.id === groupId);
  }, [rawPayments, groupId]);

  // 3. Pay Month Mutation
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  // 4. Generate available months for this group
  const availableMonths = useMemo(() => {
    if (!startDate || !monthsCount) return [];
    const months: string[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < monthsCount; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      months.push(`${yyyy}-${mm}-01`);
    }
    return months;
  }, [startDate, monthsCount]);

  // Paid months set for this specific group
  const paidMonthsSet = useMemo(() => {
    const set = new Set<string>();
    payments.forEach((p) => {
      set.add(p.subscriptionDate);
    });
    return set;
  }, [payments]);

  // Default month: first unpaid month or first available
  const defaultMonth = useMemo(() => {
    const unpaid = availableMonths.find((m) => !paidMonthsSet.has(m));
    return unpaid || availableMonths[0] || "";
  }, [availableMonths, paidMonthsSet]);

  const activeMonth = selectedMonth || defaultMonth;
  const isCurrentMonthPaid = activeMonth ? paidMonthsSet.has(activeMonth) : false;

  const handleRecordPayment = async () => {
    if (!groupStudentId || !activeMonth || isCurrentMonthPaid) return;
    await recordPayment(
      {
        groupStudentId,
        subscriptionDate: activeMonth,
        notes: notes || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setNotes("");
          }
        },
      }
    );
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        groupId
          ? `مدفوعات واشتراك الطالب في هذه المجموعة: ${studentName}`
          : `سجل مدفوعات واشتراك الطالب: ${studentName}`
      }
    >
      <div className="space-y-5 text-right" dir="rtl">
        {/* 1. Quick Pay Form (if inside group context) */}
        {groupStudentId && availableMonths.length > 0 && (
          <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <PlusCircle className="size-4 text-primary" />
                <h3 className="font-bold text-foreground text-xs">
                  تسجيل وتحصيل اشتراك شهر
                </h3>
              </div>
              {monthlyFee !== undefined && (
                <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  قيمة الاشتراك: {monthlyFee.toFixed(2)} ج.م
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
              {/* Target Month Dropdown using shared FilterDropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  <span>الشهر المستهدف:</span>
                </label>
                <FilterDropdown
                  value={activeMonth}
                  onChange={setSelectedMonth}
                  placeholder="اختر الشهر المستهدف..."
                  options={availableMonths.map((m) => {
                    const isPaid = paidMonthsSet.has(m);
                    return {
                      value: m,
                      label: `${formatMonthName(m)} ${isPaid ? "(تم السداد ✓)" : "(مستحق الدفع)"}`,
                    };
                  })}
                  className="w-full"
                />
              </div>

              {/* Notes Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  ملاحظات الدفع (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: نقداً / محفظة فودافون كاش..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors text-right"
                />
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleRecordPayment}
                disabled={isRecordPending || isCurrentMonthPaid || !activeMonth}
                className="h-9 px-5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-none"
              >
                {isRecordPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>جاري التسجيل...</span>
                  </>
                ) : isCurrentMonthPaid ? (
                  <>
                    <CheckCircle className="size-3.5" />
                    <span>تم سداد هذا الشهر مسبقاً</span>
                  </>
                ) : (
                  <>
                    <Landmark className="size-3.5" />
                    <span>تأكيد وتسجيل دفع الشهر ({monthlyFee ? `${monthlyFee.toFixed(2)} ج.م` : ""})</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* 2. Historical Payments Table (Filtered to this group) */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground text-xs flex items-center gap-2">
            <Landmark className="size-3.5 text-muted-foreground" />
            <span>
              {groupId
                ? `سجل مدفوعات الطالب في هذه المجموعة (${payments.length})`
                : `سجل العمليات السابقة (${payments.length})`}
            </span>
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="size-7 animate-spin text-primary mb-2" />
              <p className="text-xs font-semibold">جاري تحميل السجل...</p>
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-xl max-h-72 overflow-y-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-secondary/70 border-b border-border text-foreground font-bold sticky top-0">
                    {!groupId && <th className="p-3">المجموعة الدراسية</th>}
                    <th className="p-3">شهر الاشتراك</th>
                    <th className="p-3">المبلغ المدفوع</th>
                    <th className="p-3">تاريخ ووقت التحصيل</th>
                    <th className="p-3">الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      {!groupId && (
                        <td className="p-3 font-bold text-foreground">{payment.group.name}</td>
                      )}
                      <td className="p-3 font-bold text-primary">{formatMonthName(payment.subscriptionDate)}</td>
                      <td className="p-3 font-extrabold text-foreground">{payment.amount.toFixed(2)} ج.م</td>
                      <td className="p-3 font-mono text-muted-foreground text-[10px]" dir="ltr">
                        {formatFullDate(payment.paidAt)}
                      </td>
                      <td className="p-3 text-muted-foreground truncate max-w-30" title={payment.notes || ""}>
                        {payment.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-secondary/20 border border-border rounded-xl">
              <Landmark className="size-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="font-bold text-foreground text-xs">لا توجد مدفوعات مسجلة</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {groupId
                  ? "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب في هذه المجموعة بعد."
                  : "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب بعد."}
              </p>
            </div>
          )}
        </div>
      </div>
    </SharedModal>
  );
}
