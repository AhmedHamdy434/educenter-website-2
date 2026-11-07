"use client";

import { useMemo, useEffect, useRef } from "react";
import {
  Landmark,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ModalActions } from "@/components/common/ModalActions";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/components/common/form-input";
import { usePayGroupStudentMonthMutation } from "@/features/groups/hooks/mutations";
import { fmt, formatMonthName } from "@/utils/time";
import { getMonthStatusText } from "../utils/helpers";
import { PAYMENT_METHOD_OPTIONS } from "@/constants/dropdown-options";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentPayment } from "../types";
import {
  StudentPayFormValues,
  studentPaySchema,
} from "../schemas/group-pay-schema";
import { PaymentStatus } from "@/types";

interface StudentPaymentFormProps {
  summary: StudentPayment;
  isOpen: boolean;
}

export function StudentPaymentForm({
  summary,
  isOpen,
}: StudentPaymentFormProps) {
  const group = summary.group;
  const groupStudentId = summary.groupStudentId ?? null;
  const canRecordPayment = Boolean(summary.canRecordPayment);
  const months = useMemo(() => summary.months ?? [], [summary.months]);
  const monthlyFee = group?.monthlyFee ?? 0;
  // طفرة سداد اشتراك الشهر
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentPayFormValues>({
    resolver: zodResolver(studentPaySchema),
    defaultValues: {
      subscriptionDate: "",
      amount: 0,
      notes: "",
      markAsFullPayment: false,
      paymentMethod: "",
    },
  });

  const watchedSubscriptionDate = watch("subscriptionDate");
  const watchedAmount = watch("amount");
  const watchedMarkAsFullPayment = watch("markAsFullPayment");
  const watchedPaymentMethod = watch("paymentMethod");

  // الشهر النشط: اختيار المستخدم في النموذج أو defaultMonth القادم من الباك
  const activeMonth = watchedSubscriptionDate || summary.defaultMonth || "";

  const activeItem = useMemo(
    () => months.find((m) => m.month === activeMonth),
    [months, activeMonth],
  );

  const activePaid = activeItem?.paidAmount ?? 0;
  const activeRemaining = activeItem?.remainingAmount ?? 0;
  const isWaived = Boolean(activeItem?.isWaived);
  const isCurrentMonthPaid = activeItem?.status === PaymentStatus.PAID || isWaived;
  const isCurrentMonthPartial = activeItem?.status === PaymentStatus.PARTIALLY_PAID;

  // تتبع التهيئة الأولية للمودال لتجنب تصفير اختيارات المستخدم عند الـ refetch في الخلفية
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isInitializedRef.current = false;
      reset({
        subscriptionDate: "",
        amount: 0,
        notes: "",
        markAsFullPayment: false,
        paymentMethod: "",
      });
      return;
    }

    if (
      !isInitializedRef.current &&
      (summary.defaultMonth || months.length > 0)
    ) {
      const initialMonth = summary.defaultMonth || months[0]?.month || "";
      const defaultItem = months.find((m) => m.month === initialMonth);
      const remaining = defaultItem?.remainingAmount ?? 0;
      reset({
        subscriptionDate: initialMonth,
        amount: remaining > 0 ? remaining : 0,
        notes: "",
        markAsFullPayment: false,
        paymentMethod: "",
      });
      if (initialMonth) {
        isInitializedRef.current = true;
      }
    }
  }, [isOpen, summary.defaultMonth, months, reset]);

  const handleMonthChange = (m: string) => {
    setValue("subscriptionDate", m, { shouldValidate: true });
    const targetItem = months.find((item) => item.month === m);
    const remaining = targetItem?.remainingAmount ?? 0;
    setValue("amount", remaining > 0 ? remaining : 0, { shouldValidate: true });
    setValue("markAsFullPayment", false);
  };

  // التحقق من صحة المبلغ
  const enteredAmount = Number(watchedAmount);
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

  const handleRecordPayment = async (values: StudentPayFormValues) => {
    if (!canSubmit || !groupStudentId) return;
    await recordPayment(
      {
        groupStudentId,
        dto: {
          subscriptionDate: values.subscriptionDate || activeMonth,
          amount: Number(values.amount),
          notes: values.notes?.trim() || undefined,
          markAsFullPayment: values.markAsFullPayment,
          ...(values.paymentMethod ? { paymentMethod: values.paymentMethod } : {}),
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setValue("notes", "");
            setValue("markAsFullPayment", false);
            setValue("paymentMethod", "");
            const targetItem = months.find((item) => item.month === activeMonth);
            const remaining = targetItem?.remainingAmount ?? 0;
            setValue("amount", remaining > 0 ? remaining : 0);
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

  if (!showForm) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(handleRecordPayment)}
      className="bg-secondary/40 border border-border rounded-xl p-4 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-end gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {monthlyFee > 0 && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
              قيمة الاشتراك: {fmt(monthlyFee)} ج.م
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
        {/* قائمة الشهور */}
        <FilterDropdown
          label="الشهر المستهدف:"
          value={activeMonth}
          onChange={handleMonthChange}
          placeholder="اختر الشهر المستهدف..."
          options={monthOptions}
          className="w-full"
          disabled={isRecordPending}
        />

        {/* حقل المبلغ */}
        <FormInput
          label="المبلغ المراد دفعه (ج.م):"
          id="amount"
          type="number"
          max={activeRemaining > 0 ? activeRemaining : undefined}
          placeholder="أدخل المبلغ..."
          disabled={isCurrentMonthPaid || isRecordPending}
          error={errors.amount?.message}
          {...register("amount", {
            valueAsNumber: true,
            setValueAs: (val) =>
              val === "" || isNaN(Number(val)) ? 0 : Number(val),
          })}
        />
      </div>
      <div className="space-y-1">
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
            {fmt(activeRemaining)} ج.م من أصل {fmt(activeItem.amountDue)}{" "}
            ج.م
          </p>
        )}
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
              checked={watchedMarkAsFullPayment}
              onCheckedChange={(checked) =>
                setValue("markAsFullPayment", checked)
              }
              disabled={isCurrentMonthPaid || isRecordPending}
            />
          </div>
        )}

      {/* ملاحظات الدفع */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
        <FormInput
          label="ملاحظات"
          id="notes"
          type="text"
          placeholder="أدخل ملاحظات السداد والتحصيل..."
          disabled={isCurrentMonthPaid || isRecordPending}
          error={errors.notes?.message}
          {...register("notes")}
        />
        <FilterDropdown
          label="وسيلة الدفع"
          value={watchedPaymentMethod || ""}
          onChange={(val) =>
            setValue("paymentMethod", val, { shouldValidate: true })
          }
          placeholder="اختر وسيلة الدفع..."
          options={PAYMENT_METHOD_OPTIONS}
          className="w-full"
          disabled={isCurrentMonthPaid || isRecordPending}
        />
      </div>

      {/* زر التأكيد */}
      <ModalActions
        isSubmitting={isRecordPending}
        disabled={!canSubmit}
        submitLabel={
          isCurrentMonthPaid
            ? isWaived
              ? "هذا الشهر معفى من الاشتراك"
              : "تم سداد هذا الشهر بالكامل مسبقاً"
            : `تأكيد وتسجيل دفع ${isAmountValid ? `(${fmt(enteredAmount)} ج.م)` : ""}`
        }
        loadingLabel="جاري التسجيل..."
        icon={isCurrentMonthPaid ? CheckCircle : Landmark}
        size="sm"
        className="border-t-0 pt-1 mt-0"
      />
    </form>
  );
}

