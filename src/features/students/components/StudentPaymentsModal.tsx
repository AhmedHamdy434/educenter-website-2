"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Landmark,
  Loader2,
  PlusCircle,
  CheckCircle,
  Calendar,
  Coins,
  AlertCircle,
  Receipt,
  Undo2,
} from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { usePayGroupStudentMonthMutation } from "@/features/groups/hooks/mutations";
import { fmt, formatFullDate, formatMonthName } from "@/utils/time";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { cn } from "@/lib/utils";
import { StudentPayment } from "../types";
import { getMonthStatusText } from "../utils/helpers";






interface StudentPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  groupId?: string;
}

export function StudentPaymentsModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  groupId,
}: StudentPaymentsModalProps) {
  // 1. كل البيانات تأتي جاهزة من الباك (الشهور، الحالة، السجل، الإجماليات)
  const {
    data: paymentsRes,
    isLoading: isPaymentsLoading,
    isError,
    error,
    refetch,
  } = useStudentPaymentsQuery(studentId, groupId, isOpen);

  const summary = paymentsRes?.data;

  const group = summary?.group;
  const groupStudentId = summary?.groupStudentId ?? null;
  const canRecordPayment = Boolean(summary?.canRecordPayment);
  const months = useMemo(() => summary?.months ?? [], [summary?.months]);
  const payments = useMemo(() => summary?.payments ?? [], [summary?.payments]);
  const totals = summary?.totals;
  const monthlyFee = group?.monthlyFee ?? 0;

  // 2. طفرة سداد اشتراك الشهر
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  // 3. الشهر النشط: اختيار المستخدم أو defaultMonth القادم من الباك
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const activeMonth = selectedMonth || summary?.defaultMonth || "";

  const activeItem = useMemo(
    () => months.find((m) => m.month === activeMonth),
    [months, activeMonth],
  );

  const activePaid = activeItem?.paidAmount ?? 0;
  const activeRemaining = activeItem?.remainingAmount ?? 0;
  const isWaived = Boolean(activeItem?.isWaived);
  const isCurrentMonthPaid = activeItem?.status === "PAID" || isWaived;
  const isCurrentMonthPartial = activeItem?.status === "PARTIALLY_PAID";

  // 4. حقل المبلغ المخصص والملاحظات وخيار السداد الكامل
  const [customAmount, setCustomAmount] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [markAsFullPayment, setMarkAsFullPayment] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setSelectedMonth("");
    setCustomAmount(null);
    setNotes("");
    setMarkAsFullPayment(false);
    onClose();
  }, [onClose]);

  const handleMonthChange = (m: string) => {
    setSelectedMonth(m);
    setCustomAmount(null);
    setMarkAsFullPayment(false);
  };

  // المبلغ المعروض: القيمة المخصصة إن وُجدت، وإلا كامل المتبقي للشهر النشط
  const displayAmount =
    customAmount !== null
      ? customAmount
      : activeRemaining > 0
        ? String(activeRemaining)
        : "";

  // 5. التحقق من صحة المبلغ
  const enteredAmount = Number(displayAmount);
  const isAmountPositive = !isNaN(enteredAmount) && enteredAmount > 0;
  const isAmountExceeding =
    activeRemaining > 0 &&
    !isNaN(enteredAmount) &&
    enteredAmount > activeRemaining;
  const isAmountValid = isAmountPositive && !isAmountExceeding;

  const canSubmit =
    canRecordPayment &&
    !isRecordPending &&
    !isCurrentMonthPaid &&
    Boolean(activeMonth) &&
    Boolean(groupStudentId) &&
    isAmountValid;

  const handleRecordPayment = async () => {
    if (!canSubmit || !groupStudentId) return;
    await recordPayment(
      {
        groupStudentId,
        dto: {
          subscriptionDate: activeMonth,
          amount: enteredAmount,
          notes: notes.trim(),
          markAsFullPayment: markAsFullPayment,
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setNotes("");
            setCustomAmount(null);
            setMarkAsFullPayment(false);
          }
        },
      },
    );
  };

  const monthOptions = useMemo(
    () =>
      months.map((m) => ({
        value: m.month,
        label: `${formatMonthName(m.month)} ${getMonthStatusText(m)}`,
      })),
    [months],
  );

  const showForm =
    canRecordPayment && Boolean(groupStudentId) && months.length > 0;

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        groupId
          ? `مدفوعات واشتراك الطالب في هذه المجموعة: ${studentName}`
          : `سجل مدفوعات واشتراك الطالب: ${studentName}`
      }
    >
      <div className="space-y-5 text-right" dir="rtl">
        {/* ملخص الإجماليات */}
        {totals && !isPaymentsLoading && !isError && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <SummaryCard
              label="عدد العمليات"
              value={String(totals.paymentsCount)}
            />
            <SummaryCard
              label="إجمالي المسدد"
              value={`${fmt(totals.totalPaid)} ج.م`}
              tone="success"
            />
            <SummaryCard
              label="إجمالي المسترد"
              value={`${fmt(totals.totalRefunded)} ج.م`}
              tone={totals.totalRefunded > 0 ? "danger" : "default"}
            />
            <SummaryCard
              label="إجمالي المتبقي"
              value={`${fmt(totals.totalRemaining)} ج.م`}
              tone={totals.totalRemaining > 0 ? "warning" : "default"}
            />
          </div>
        )}

        {/* 1. نموذج التحصيل */}
        {showForm && (
          <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <PlusCircle className="size-4 text-primary" />
                <h3 className="font-bold text-foreground text-xs">
                  تسجيل وتحصيل اشتراك شهر
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {monthlyFee > 0 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                    قيمة الاشتراك: {fmt(monthlyFee)} ج.م
                  </span>
                )}
                {activeItem && activeItem.amountDue !== monthlyFee && (
                  <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                    المستحق لهذا الشهر: {fmt(activeItem.amountDue)} ج.م
                  </span>
                )}
                {activePaid > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    المسدد: {fmt(activePaid)} ج.م
                  </span>
                )}
                {activeRemaining > 0 && activePaid > 0 && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    المتبقي: {fmt(activeRemaining)} ج.م
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
              {/* قائمة الشهور */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  <span>الشهر المستهدف:</span>
                </label>
                <FilterDropdown
                  value={activeMonth}
                  onChange={handleMonthChange}
                  placeholder="اختر الشهر المستهدف..."
                  options={monthOptions}
                  className="w-full"
                />
              </div>

              {/* حقل المبلغ */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Coins className="size-3.5" />
                    <span>المبلغ المراد دفعه (ج.م):</span>
                  </label>
                  {activeRemaining > 0 &&
                    enteredAmount !== activeRemaining &&
                    !isCurrentMonthPaid && (
                      <button
                        type="button"
                        onClick={() => setCustomAmount(null)}
                        className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                      >
                        دفع كامل المتبقي ({fmt(activeRemaining)} ج.م)
                      </button>
                    )}
                </div>
                <input
                  type="number"
                  min={0.01}
                  max={activeRemaining > 0 ? activeRemaining : undefined}
                  step="any"
                  placeholder={
                    activeRemaining > 0
                      ? String(activeRemaining)
                      : "أدخل المبلغ..."
                  }
                  value={displayAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  disabled={isCurrentMonthPaid || isRecordPending}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-card text-foreground text-sm focus:outline-none transition-colors text-right",
                    isAmountExceeding
                      ? "border-destructive focus:border-destructive text-destructive"
                      : "border-input focus:border-primary",
                    (isCurrentMonthPaid || isRecordPending) &&
                      "opacity-60 cursor-not-allowed bg-muted/30",
                  )}
                />
                {isAmountExceeding && (
                  <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>
                      المبلغ المدخل ({fmt(enteredAmount)} ج.م) أكبر من المتبقي (
                      {fmt(activeRemaining)} ج.م).
                    </span>
                  </p>
                )}
                {!isAmountExceeding && isCurrentMonthPartial && activeItem && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    سداد جزئي: مدفوع مسبقاً {fmt(activePaid)} ج.م ومتبقي{" "}
                    {fmt(activeRemaining)} ج.م من أصل{" "}
                    {fmt(activeItem.amountDue)} ج.م
                  </p>
                )}
              </div>
            </div>

            {/* خيار اعتبار الشهر مسدداً بالكامل عند دفع مبلغ أقل من المتبقي */}
            {activeRemaining > 0 &&
              enteredAmount > 0 &&
              enteredAmount < activeRemaining &&
              !isCurrentMonthPaid && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground transition-all">
                  <div className="space-y-0.5 text-right">
                    <label
                      htmlFor="markAsFullPayment"
                      className="text-xs font-bold text-foreground cursor-pointer block"
                    >
                      اعتبار هذا الشهر مسدداً بالكامل (خصم وإعفاء من المتبقي)
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      سيتم تصفير المبلغ المتبقي (
                      {fmt(activeRemaining - enteredAmount)} ج.م) واحتساب الشهر
                      كمدفوع بالكامل.
                    </p>
                  </div>
                  <Switch
                    id="markAsFullPayment"
                    checked={markAsFullPayment}
                    onCheckedChange={setMarkAsFullPayment}
                    disabled={isCurrentMonthPaid || isRecordPending}
                  />
                </div>
              )}

            {/* ملاحظات الدفع */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                ملاحظات الدفع (اختياري):
              </label>
              <input
                type="text"
                placeholder="مثال: نقداً / محفظة إلكترونية / دفعة أولى..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isCurrentMonthPaid || isRecordPending}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors text-right disabled:opacity-60"
              />
            </div>

            {/* زر التأكيد */}
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleRecordPayment}
                disabled={!canSubmit}
                className="h-9 px-5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-none cursor-pointer"
              >
                {isRecordPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>جاري التسجيل...</span>
                  </>
                ) : isCurrentMonthPaid ? (
                  <>
                    <CheckCircle className="size-3.5" />
                    <span>
                      {isWaived
                        ? "هذا الشهر معفى من الاشتراك"
                        : "تم سداد هذا الشهر بالكامل مسبقاً"}
                    </span>
                  </>
                ) : (
                  <>
                    <Landmark className="size-3.5" />
                    <span>
                      تأكيد وتسجيل دفع{" "}
                      {isAmountValid ? `(${fmt(enteredAmount)} ج.م)` : ""}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* 2. سجل المدفوعات */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground text-xs flex items-center gap-2">
            <Landmark className="size-3.5 text-muted-foreground" />
            <span>
              {groupId
                ? `سجل مدفوعات الطالب في هذه المجموعة (${payments.length})`
                : `سجل العمليات السابقة (${payments.length})`}
            </span>
          </h3>

          {isPaymentsLoading ? (
            <Loading />
          ) : isError ? (
            <QueryErrorState
              title="تعذر تحميل سجل المدفوعات"
              error={error}
              onRetry={refetch}
              compact
            />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-xl max-h-72 overflow-y-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-secondary/70 border-b border-border text-foreground font-bold sticky top-0">
                    <th className="p-3">رقم الإيصال</th>
                    {!groupId && <th className="p-3">المجموعة الدراسية</th>}
                    <th className="p-3">شهر الاشتراك</th>
                    <th className="p-3">المبلغ المدفوع</th>
                    <th className="p-3">طريقة الدفع</th>
                    <th className="p-3">تاريخ ووقت التحصيل</th>
                    <th className="p-3">الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {payments.map((payment) => {
                    const hasRefund = payment.refundedAmount > 0;
                    const netAmount = payment.amount - payment.refundedAmount;
                    const isRowFull = payment.status === "PAID";

                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Receipt className="size-3 shrink-0" />
                            <span>{payment.receiptNumber}</span>
                            {payment.isLegacy && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border font-sans">
                                قديم
                              </span>
                            )}
                          </div>
                        </td>
                        {!groupId && (
                          <td className="p-3 font-bold text-foreground">
                            {payment.groupName || "المجموعة"}
                          </td>
                        )}
                        <td className="p-3 font-bold text-primary">
                          {formatMonthName(payment.subscriptionDate)}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-foreground">
                              {fmt(payment.amount)} ج.م
                            </span>
                            {hasRefund && (
                              <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
                                <Undo2 className="size-3" />
                                مسترد {fmt(payment.refundedAmount)} ج.م (الصافي{" "}
                                {fmt(netAmount)} ج.م)
                              </span>
                            )}
                            {isRowFull ? (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                تم السداد بالكامل ✓
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                سداد جزئي (متبقي {fmt(payment.remainingAfter)}{" "}
                                ج.م من {fmt(payment.amountDue)} ج.م)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {payment.paymentMethod}
                        </td>
                        <td
                          className="p-3 font-mono text-muted-foreground text-[10px]"
                          dir="ltr"
                        >
                          {formatFullDate(payment.paidAt)}
                        </td>
                        <td
                          className="p-3 text-muted-foreground truncate max-w-30"
                          title={payment.notes || ""}
                        >
                          {payment.notes || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Landmark}
              title="لا توجد مدفوعات مسجلة"
              description={
                groupId
                  ? "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب في هذه المجموعة بعد."
                  : "لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب بعد."
              }
              compact
              className="border border-border rounded-xl bg-secondary/20"
            />
          )}
        </div>
      </div>
    </SharedModal>
  );
}

/* ------------------------------------------------------------------ */
/* بطاقة صغيرة للإجماليات                                              */
/* ------------------------------------------------------------------ */
function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 flex flex-col gap-0.5",
        tone === "default" && "bg-secondary/40 border-border",
        tone === "success" &&
          "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
        tone === "warning" &&
          "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
        tone === "danger" && "bg-destructive/10 border-destructive/30",
      )}
    >
      <span className="text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-extrabold text-foreground">{value}</span>
    </div>
  );
}
