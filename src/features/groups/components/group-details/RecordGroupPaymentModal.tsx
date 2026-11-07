"use client";

import { useCallback, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/components/common/form-input";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { PAYMENT_METHOD_OPTIONS } from "@/constants/dropdown-options";
import { fmt, formatMonthName } from "@/utils/time";
import { PaymentStatus } from "@/types";
import { usePayGroupStudentMonthMutation } from "../../hooks/mutations";
import { type GroupStudentPaymentInfo } from "../../types";
import {
  recordGroupPaymentSchema,
  type RecordGroupPaymentFormValues,
} from "../../schemas/group-payment-schema";

interface RecordGroupPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: GroupStudentPaymentInfo | null;
  activeMonth: string;
  isExpired?: boolean;
}

export function RecordGroupPaymentModal({
  isOpen,
  onClose,
  student,
  activeMonth,
  isExpired = false,
}: RecordGroupPaymentModalProps) {
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  const monthlyFee = student?.monthlyFee ?? 0;
  const amountDue = student?.currentMonth?.amountDue ?? monthlyFee;
  const paidAmount = student?.currentMonth?.paidAmount ?? 0;
  const remainingAmount = Math.max(0, amountDue - paidAmount);
  const isCurrentMonthPaid =
    student?.currentMonth?.status === PaymentStatus.PAID;
  const isCurrentMonthPartial =
    student?.currentMonth?.status === PaymentStatus.PARTIALLY_PAID;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecordGroupPaymentFormValues>({
    resolver: zodResolver(recordGroupPaymentSchema),
    defaultValues: {
      amount: 0,
      notes: "",
      markAsFullPayment: false,
      paymentMethod: "",
    },
  });

  const watchedAmount = watch("amount");
  const watchedMarkAsFullPayment = watch("markAsFullPayment");
  const watchedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (!isOpen || !student) return;

    const mFee = student.monthlyFee ?? 0;
    const aDue = student.currentMonth?.amountDue ?? mFee;
    const pAmt = student.currentMonth?.paidAmount ?? 0;
    const rem = Math.max(0, aDue - pAmt);

    reset({
      amount: rem > 0 ? rem : mFee,
      notes: "",
      markAsFullPayment: false,
      paymentMethod: "",
    });
  }, [isOpen, student, reset]);

  const handleClose = useCallback(() => {
    reset({
      amount: 0,
      notes: "",
      markAsFullPayment: false,
      paymentMethod: "",
    });
    onClose();
  }, [onClose, reset]);

  const enteredAmount = Number(watchedAmount);
  const isAmountPositive = !isNaN(enteredAmount) && enteredAmount > 0;
  const isAmountExceeding =
    remainingAmount > 0 &&
    !isNaN(enteredAmount) &&
    enteredAmount > remainingAmount;
  const isAmountValid = isAmountPositive && !isAmountExceeding;

  const canSubmit =
    !isExpired &&
    !isRecordPending &&
    !isCurrentMonthPaid &&
    Boolean(activeMonth) &&
    Boolean(student?.groupStudentId) &&
    isAmountValid;

  const handleRecordPayment = async (values: RecordGroupPaymentFormValues) => {
    if (!canSubmit || !student?.groupStudentId) return;

    await recordPayment(
      {
        groupStudentId: student.groupStudentId,
        dto: {
          subscriptionDate: activeMonth,
          amount: Number(values.amount),
          notes: values.notes?.trim() || undefined,
          markAsFullPayment: values.markAsFullPayment,
          ...(values.paymentMethod
            ? { paymentMethod: values.paymentMethod }
            : {}),
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            handleClose();
          }
        },
      },
    );
  };

  if (!student) {
    return null;
  }

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="تحصيل اشتراك الطالب"
    >
      <form onSubmit={handleSubmit(handleRecordPayment)} className="space-y-4">
        {/* ملخص بيانات الطالب واشتراك الشهر */}
        <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">الطالب:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {student.studentInfo?.fullName}
              </span>
              {student.studentInfo?.code && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                  {student.studentInfo.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">الشهر:</span>
            <span className="font-bold text-foreground">
              {formatMonthName(activeMonth)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-border pt-2.5 flex-wrap gap-2">
            <span className="text-muted-foreground font-medium">
              تفاصيل الرسوم:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {monthlyFee > 0 && (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  قيمة الاشتراك: {fmt(monthlyFee)} ج.م
                </span>
              )}
              {amountDue !== monthlyFee && (
                <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                  المستحق لهذا الشهر: {fmt(amountDue)} ج.م
                </span>
              )}
              {paidAmount > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  المسدد: {fmt(paidAmount)} ج.م
                </span>
              )}
              {remainingAmount > 0 && paidAmount > 0 && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  المتبقي: {fmt(remainingAmount)} ج.م
                </span>
              )}
            </div>
          </div>
        </div>

        {/* حقل المبلغ */}
        <FormInput
          label="المبلغ المراد دفعه (ج.م):"
          id="amount"
          type="number"
          max={remainingAmount > 0 ? remainingAmount : undefined}
          placeholder="أدخل المبلغ..."
          disabled={isCurrentMonthPaid || isRecordPending}
          error={errors.amount?.message}
          {...register("amount", {
            valueAsNumber: true,
            setValueAs: (val) =>
              val === "" || isNaN(Number(val)) ? 0 : Number(val),
          })}
        />

        {/* رسائل التنبيه للمبلغ */}
        <div className="space-y-1">
          {isAmountExceeding && (
            <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
              <AlertCircle className="size-3 shrink-0" />
              <span>
                المبلغ المدخل ({fmt(enteredAmount)} ج.م) أكبر من المتبقي (
                {fmt(remainingAmount)} ج.م).
              </span>
            </p>
          )}
          {!isAmountExceeding && isCurrentMonthPartial && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              سداد جزئي: مدفوع مسبقاً {fmt(paidAmount)} ج.م ومتبقي{" "}
              {fmt(remainingAmount)} ج.م من أصل {fmt(amountDue)} ج.م
            </p>
          )}
        </div>

        {/* خيار اعتبار الشهر مسدداً بالكامل عند دفع مبلغ أقل من المتبقي */}
        {remainingAmount > 0 &&
          enteredAmount > 0 &&
          enteredAmount < remainingAmount &&
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
                  {fmt(remainingAmount - enteredAmount)} ج.م) واحتساب الشهر
                  كمدفوع بالكامل.
                </p>
              </div>
              <Switch
                id="markAsFullPayment"
                checked={watchedMarkAsFullPayment}
                onCheckedChange={(checked) =>
                  setValue("markAsFullPayment", checked)
                }
                disabled={isCurrentMonthPaid || isRecordPending}
              />
            </div>
          )}

        {/* الملاحظات ووسيلة الدفع */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
          <FormInput
            label="ملاحظات"
            id="notes"
            type="text"
            placeholder="ادخل ملاحظات"
            disabled={isCurrentMonthPaid || isRecordPending}
            error={errors.notes?.message}
            {...register("notes")}
          />
          <FilterDropdown
            label="وسيلة الدفع"
            value={watchedPaymentMethod || ""}
            onChange={(val) => setValue("paymentMethod", val)}
            placeholder="اختر وسيلة الدفع..."
            options={PAYMENT_METHOD_OPTIONS}
            className="w-full"
            disabled={isCurrentMonthPaid || isRecordPending}
          />
        </div>

        {/* أزرار الإجراءات */}
        <ModalActions
          onCancel={handleClose}
          isLoading={isRecordPending}
          disabled={!canSubmit}
          submitLabel={
            isCurrentMonthPaid
              ? "تم سداد هذا الشهر مسبقاً"
              : `تأكيد وتسجيل الدفع ${isAmountValid ? `(${fmt(enteredAmount)} ج.م)` : ""}`
          }
          loadingLabel="جاري التسجيل..."
          icon={CheckCircle}
        />
      </form>
    </SharedModal>
  );
}
