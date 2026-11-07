"use client";

import React, { useState } from "react";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle2, ListOrdered, Sparkles } from "lucide-react";
import { TeacherFinancialRow, PaymentMethodType } from "../types";
import { useTeacherUnsettledEarningsQuery } from "../hooks/queries";
import { useCreateSettlementMutation } from "../hooks/mutations";

interface CreateSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherFinancialRow | null;
}

function CreateSettlementForm({
  teacher,
  onClose,
}: {
  teacher: TeacherFinancialRow;
  onClose: () => void;
}) {
  const [allocationMode, setAllocationMode] = useState<"FIFO" | "MANUAL">("FIFO");
  const [amount, setAmount] = useState<number>(teacher.availablePayableBalance);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CASH");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isPendingStatus, setIsPendingStatus] = useState<boolean>(false);
  const [manualAllocations, setManualAllocations] = useState<Record<string, number>>({});

  const { data: unsettledData, isLoading: loadingUnsettled } = useTeacherUnsettledEarningsQuery(
    teacher.teacherId,
    !!teacher.teacherId,
  );

  const createMutation = useCreateSettlementMutation();

  const handleManualItemToggle = (itemId: string, remainingAmount: number, checked: boolean) => {
    setManualAllocations((prev) => {
      const updated = { ...prev };
      if (checked) {
        updated[itemId] = remainingAmount;
      } else {
        delete updated[itemId];
      }
      const newTotal = Object.values(updated).reduce((sum, val) => sum + val, 0);
      setAmount(Number(newTotal.toFixed(2)));
      return updated;
    });
  };

  const handleManualItemAmountChange = (itemId: string, maxAmount: number, val: number) => {
    const clamped = Math.min(maxAmount, Math.max(0, val));
    setManualAllocations((prev) => {
      const updated = { ...prev };
      if (clamped > 0) {
        updated[itemId] = clamped;
      } else {
        delete updated[itemId];
      }
      const newTotal = Object.values(updated).reduce((sum, val) => sum + val, 0);
      setAmount(Number(newTotal.toFixed(2)));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) return;
    if (amount > teacher.availablePayableBalance) return;

    const allocationsList =
      allocationMode === "MANUAL"
        ? Object.entries(manualAllocations).map(([earningEntryId, allocAmount]) => ({
            earningEntryId,
            amount: allocAmount,
          }))
        : undefined;

    createMutation.mutate(
      {
        teacherId: teacher.teacherId,
        amount,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        status: isPendingStatus ? "PENDING" : "COMPLETED",
        allocations: allocationsList,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const isExceeding = amount > teacher.availablePayableBalance;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-right">
      {/* Balance Overview Banner */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium">الرصيد المتاح للصرف حالياً</div>
          <div className="text-2xl font-black text-primary mt-0.5">
            {teacher.availablePayableBalance.toLocaleString()} <span className="text-sm font-semibold">ج.م</span>
          </div>
        </div>
        <div className="text-left text-xs space-y-1">
          <div className="text-muted-foreground">
            صافي المستحقات: <span className="font-semibold text-foreground">{teacher.netEarnings.toLocaleString()} ج.م</span>
          </div>
          <div className="text-muted-foreground">
            المنصرف سابقاً: <span className="font-semibold text-emerald-600">{teacher.settledAmount.toLocaleString()} ج.م</span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => {
            setAllocationMode("FIFO");
            setAmount(teacher.availablePayableBalance);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            allocationMode === "FIFO"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="size-3.5 text-primary" />
          تخصيص تلقائي ذكي (FIFO)
        </button>
        <button
          type="button"
          onClick={() => {
            setAllocationMode("MANUAL");
            setAmount(0);
            setManualAllocations({});
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            allocationMode === "MANUAL"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListOrdered className="size-3.5 text-primary" />
          تحديد يدوي لبنود المستحقات ({unsettledData?.entries?.length || 0})
        </button>
      </div>

      {/* Manual Items Selection Table */}
      {allocationMode === "MANUAL" && (
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground">
            اختر بنود اشتراكات الطلاب المراد تسويتها وتحديد المبالغ:
          </Label>
          <div className="max-h-56 overflow-y-auto border border-border rounded-xl">
            {loadingUnsettled ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                جاري تحميل بنود المستحقات...
              </div>
            ) : !unsettledData?.entries || unsettledData.entries.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                لا توجد بنود مستحقات غير مسواة متاحة لهذا المعلم.
              </div>
            ) : (
              <Table dir="rtl">
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="text-right text-xs">الطالب / المجموعة</TableHead>
                    <TableHead className="text-center text-xs">إجمالي البند</TableHead>
                    <TableHead className="text-center text-xs">المتبقي</TableHead>
                    <TableHead className="text-center text-xs">المبلغ المخصص</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unsettledData.entries.map((item) => {
                    const isChecked = !!manualAllocations[item.id];
                    const currentAlloc = manualAllocations[item.id] || 0;

                    return (
                      <TableRow key={item.id} className="text-xs">
                        <TableCell className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleManualItemToggle(item.id, item.remainingUnsettledAmount, e.target.checked)
                            }
                            className="size-4 rounded accent-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="p-2 font-medium">
                          <div className="font-bold text-foreground">{item.studentName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.groupOrSessionName} • {item.receiptNumber || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="p-2 text-center">
                          {item.totalAmount} ج.م
                        </TableCell>
                        <TableCell className="p-2 text-center font-bold text-primary">
                          {item.remainingUnsettledAmount} ج.م
                        </TableCell>
                        <TableCell className="p-2 text-center">
                          <Input
                            type="number"
                            min={0}
                            max={item.remainingUnsettledAmount}
                            step={1}
                            value={isChecked ? currentAlloc : ""}
                            disabled={!isChecked}
                            placeholder="0"
                            onChange={(e) =>
                              handleManualItemAmountChange(
                                item.id,
                                item.remainingUnsettledAmount,
                                Number(e.target.value) || 0,
                              )
                            }
                            className="w-20 h-7 text-center text-xs font-bold mx-auto"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* Settlement Amount */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-foreground">
          مبلغ التسوية المراد صرفه (ج.م) *
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={teacher.availablePayableBalance}
            step={1}
            value={amount || ""}
            disabled={allocationMode === "MANUAL"}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="text-lg font-bold"
            placeholder="0.00"
            required
          />
          {allocationMode === "FIFO" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(teacher.availablePayableBalance)}
              className="text-xs shrink-0"
            >
              المبلغ بالكامل
            </Button>
          )}
        </div>
        {isExceeding && (
          <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
            <AlertCircle className="size-3.5" />
            المبلغ المطلوب يتجاوز الرصيد المتاح للصرف للمعلم ({teacher.availablePayableBalance} ج.م).
          </p>
        )}
      </div>

      {/* Payment Method & Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">طريقة الصرف *</Label>
          <Select
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as PaymentMethodType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر طريقة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">نقداً (خزينة المركز)</SelectItem>
              <SelectItem value="BANK_TRANSFER">تحويل بنكي</SelectItem>
              <SelectItem value="WALLET">محفظة إلكترونية (Vodafone/InstaPay)</SelectItem>
              <SelectItem value="POS">بطاقة بنكية / POS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">رقم المرجع / الحوالة</Label>
          <Input
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="مثال: رقم العملية أو إيصال التحويل"
            className="text-xs"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-foreground">ملاحظات وبيان الصرف</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أدخل أي ملاحظات إضافية حول هذه التسوية..."
          rows={2}
          className="text-xs"
        />
      </div>

      {/* Status Mode Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
        <div className="space-y-0.5">
          <Label className="text-xs font-bold text-foreground">
            تسجيل التسوية كـ &quot;حجز معلق&quot; (PENDING)
          </Label>
          <p className="text-[11px] text-muted-foreground">
            حجز المبلغ من مستحقات المعلم لتجهيز الحوالة دون اعتباره منصرفاً نهائياً إلا بعد التأكيد.
          </p>
        </div>
        <Switch
          checked={isPendingStatus}
          onCheckedChange={setIsPendingStatus}
        />
      </div>

      {/* Actions */}
      <ModalActions
        onCancel={onClose}
        isSubmitting={createMutation.isPending}
        disabled={amount <= 0 || isExceeding}
        submitLabel={
          isPendingStatus
            ? `حجز تسوية معلقة (${amount.toLocaleString()} ج.م)`
            : `تأكيد وصرف التسوية (${amount.toLocaleString()} ج.م)`
        }
        loadingLabel="جاري التسجيل..."
        icon={CheckCircle2}
        size="sm"
        className="pt-3"
      />
    </form>
  );
}

export function CreateSettlementModal({
  isOpen,
  onClose,
  teacher,
}: CreateSettlementModalProps) {
  if (!teacher) return null;

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`صرف تسوية مالية: ${teacher.name}`}
    >
      <CreateSettlementForm
        key={teacher.teacherId}
        teacher={teacher}
        onClose={onClose}
      />
    </SharedModal>
  );
}
