"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Calendar,
  Landmark,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SharedModal } from "@/components/common/SharedModal";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { useGroupPaymentsQuery, useGroupQuery } from "../../hooks/queries";
import { usePayGroupStudentMonthMutation } from "../../hooks/mutations";
import { type GroupStudentPaymentInfo } from "../../types";
import { formatMonthName } from "@/utils/time";

interface GroupPaymentsTabProps {
  groupId: string;
}

export function GroupPaymentsTab({ groupId }: GroupPaymentsTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<GroupStudentPaymentInfo | null>(null);
  const [notes, setNotes] = useState("");

  // 1. Fetch group details to get startDate and monthsCount
  const { data: groupRes } = useGroupQuery(groupId);
  const group = groupRes?.data;

  // 2. Fetch payments list
  const { data: paymentsRes, isLoading: isPaymentsLoading } =
    useGroupPaymentsQuery(groupId);
  const payments = useMemo(
    () => paymentsRes?.data || [],
    [paymentsRes?.data]
  );

  // 3. Mutation for recording payment
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  const startDate = group?.startDate;
  const monthsCount = group?.monthsCount;

  // Generate available months based on group schedule duration
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

  const defaultMonth = useMemo(() => {
    if (availableMonths.length === 0) return "";
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    return availableMonths.includes(todayStr) ? todayStr : availableMonths[0];
  }, [availableMonths]);

  const activeMonth = selectedMonth || defaultMonth;

  // Filter students based on search query
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (item) =>
        item.studentInfo.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.studentInfo.phone.includes(searchQuery),
    );
  }, [payments, searchQuery]);

  // Calculate statistics for the active month
  const stats = useMemo(() => {
    if (!activeMonth || payments.length === 0) {
      return {
        total: payments.length,
        paid: 0,
        unpaid: 0,
        expected: 0,
        collected: 0,
      };
    }

    let paidCount = 0;
    let unpaidCount = 0;
    let expectedRevenue = 0;
    let collectedRevenue = 0;

    payments.forEach((student) => {
      // Is this month required for this student?
      const isRequired = student.requiredMonths.includes(activeMonth);
      if (isRequired) {
        expectedRevenue += student.monthlyFee;

        // Has student paid for this month?
        const paymentRecord = student.paidMonths.find(
          (p) => p.subscriptionDate === activeMonth,
        );

        if (paymentRecord) {
          paidCount++;
          collectedRevenue += paymentRecord.amount;
        } else {
          unpaidCount++;
        }
      }
    });

    return {
      total: payments.length,
      paid: paidCount,
      unpaid: unpaidCount,
      expected: expectedRevenue,
      collected: collectedRevenue,
    };
  }, [activeMonth, payments]);

  const handleOpenRecordModal = (student: GroupStudentPaymentInfo) => {
    setSelectedStudent(student);
    setNotes("");
  };

  const handleCloseRecordModal = () => {
    setSelectedStudent(null);
    setNotes("");
  };

  const handleRecordPayment = async () => {
    if (!selectedStudent || !activeMonth) return;
    await recordPayment(
      {
        groupStudentId: selectedStudent.groupStudentId,
        subscriptionDate: activeMonth,
        notes: notes || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            handleCloseRecordModal();
          }
        },
      },
    );
  };

  if (isPaymentsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-10 animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold">جاري تحميل بيانات الاشتراكات...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground bg-secondary/20 border border-border rounded-xl shadow-none">
        <CreditCard className="size-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="font-bold text-foreground">
          لا يوجد طلاب مسجلون بالمجموعة
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          قم بإدراج طلاب أولاً لتتمكن من إدارة الاشتراكات والمدفوعات الخاصة بهم.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Month Selector & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-xl shadow-none">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="size-5 text-primary shrink-0" />
          <label className="text-sm font-bold text-foreground shrink-0">
            الشهر المستهدف:
          </label>
          <FilterDropdown
            value={activeMonth}
            onChange={setSelectedMonth}
            placeholder="اختر الشهر المستهدف..."
            options={availableMonths.map((m) => ({
              value: m,
              label: formatMonthName(m),
            }))}
            className="w-full sm:w-56"
          />
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن طالب بالاسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pr-10 pl-3 rounded-xl border border-input bg-card text-sm text-right"
          />
        </div>
      </div>

      {/* 2. Summary Statistics Cards with Tinted Hero & Varied Accent Borders */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Students */}
        <Card className="p-4 flex flex-col justify-between border border-border border-r-3 border-r-foreground/40 bg-card rounded-xl shadow-none">
          <span className="text-xs text-muted-foreground font-semibold">
            إجمالي الطلاب
          </span>
          <span className="text-2xl font-black text-foreground mt-2">
            {stats.total}
          </span>
        </Card>

        {/* Paid (Outlined Pill) */}
        <Card className="p-4 flex flex-col justify-between border border-border border-r-3 border-r-emerald-600 bg-card rounded-xl shadow-none">
          <span className="text-xs text-emerald-800 bg-emerald-50/80 border border-emerald-300/80 px-2 py-0.5 rounded-full font-bold self-start">
            المسددون
          </span>
          <span className="text-2xl font-black text-emerald-800 mt-2">
            {stats.paid}
          </span>
        </Card>

        {/* Unpaid (Outlined Pill) */}
        <Card className="p-4 flex flex-col justify-between border border-border border-r-3 border-r-rose-600 bg-card rounded-xl shadow-none">
          <span className="text-xs text-rose-800 bg-rose-50/80 border border-rose-300/80 px-2 py-0.5 rounded-full font-bold self-start">
            المتبقون
          </span>
          <span className="text-2xl font-black text-rose-800 mt-2">
            {stats.unpaid}
          </span>
        </Card>

        {/* Expected Revenue */}
        <Card className="p-4 flex flex-col justify-between border border-border border-r-3 border-r-foreground/40 bg-card rounded-xl shadow-none">
          <span className="text-xs text-muted-foreground font-semibold">
            الإيراد المتوقع
          </span>
          <span className="text-lg font-black text-foreground mt-2">
            {stats.expected.toFixed(2)} ج.م
          </span>
        </Card>

        {/* Collected Revenue (Tinted Hero Focus) */}
        <Card className="p-4 flex flex-col justify-between border border-primary/25 border-r-4 border-r-primary bg-primary/5 rounded-xl shadow-none">
          <span className="text-xs text-primary font-bold">
            الإيراد المحصل
          </span>
          <span className="text-xl font-black text-primary mt-2">
            {stats.collected.toFixed(2)} ج.م
          </span>
        </Card>
      </div>

      {/* 3. Students Payments Table */}
      <Card className="p-0 overflow-hidden border border-border bg-card rounded-xl shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead className="bg-secondary/70 text-foreground font-bold text-xs">
              <tr>
                <th className="px-5 py-3">اسم الطالب</th>
                <th className="px-5 py-3">رقم الهاتف</th>
                <th className="px-5 py-3">بداية الاشتراك</th>
                <th className="px-5 py-3">الاشتراك الشهري</th>
                <th className="px-5 py-3 text-center">حالة الدفع</th>
                <th className="px-5 py-3 text-center">الملاحظات</th>
                <th className="px-5 py-3 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground text-xs">
              {filteredPayments.map((item) => {
                const isRequired = item.requiredMonths.includes(activeMonth);
                const paymentRecord = item.paidMonths.find(
                  (p) => p.subscriptionDate === activeMonth,
                );
                const isPaid = !!paymentRecord;

                return (
                  <tr
                    key={item.groupStudentId}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-bold text-foreground">
                      <div className="flex flex-col">
                        <span>{item.studentInfo.fullName}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.studentInfo.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground" dir="ltr">
                      {item.studentInfo.phone}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {item.subscriptionStartDate
                        ? new Date(
                            item.subscriptionStartDate,
                          ).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>
                    <td className="px-5 py-3 font-bold text-foreground">
                      {item.monthlyFee.toFixed(2)} ج.م
                    </td>
                    <td className="px-5 py-3 text-center">
                      {!isRequired ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100/80 text-stone-700 border border-stone-300/80">
                          غير مستحق
                        </span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50/80 text-emerald-800 border border-emerald-300/80">
                          <CheckCircle className="size-3" />
                          تم التحصيل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50/80 text-rose-800 border border-rose-300/80">
                          <AlertCircle className="size-3" />
                          غير مدفوع
                        </span>
                      )}
                    </td>
                    <td
                      className="px-5 py-3 text-center text-xs text-muted-foreground max-w-36 truncate"
                      title={paymentRecord?.notes || ""}
                    >
                      {paymentRecord?.notes || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {isRequired && !isPaid && (
                        <Button
                          onClick={() => handleOpenRecordModal(item)}
                          variant="brand"
                          size="sm"
                          className="h-8 px-3 rounded-lg text-xs flex items-center gap-1 mx-auto font-bold shadow-none"
                        >
                          <Landmark className="size-3.5" />
                          تسجيل الدفع
                        </Button>
                      )}
                      {(!isRequired || isPaid) && (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Record Payment Modal Dialog */}
      {selectedStudent && (
        <SharedModal
          isOpen={!!selectedStudent}
          onClose={handleCloseRecordModal}
          title="تحصيل اشتراك الطالب"
        >
          <div className="space-y-4 text-right" dir="rtl">
            <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الطالب:</span>
                <span className="font-bold text-foreground">
                  {selectedStudent.studentInfo.fullName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشهر:</span>
                <span className="font-bold text-foreground">
                  {formatMonthName(activeMonth)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">مبلغ الاشتراك:</span>
                <span className="font-bold text-primary">
                  {selectedStudent.monthlyFee.toFixed(2)} ج.م
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="paymentNotes"
                className="text-xs font-bold text-foreground"
              >
                ملاحظات الدفع (اختياري)
              </label>
              <textarea
                id="paymentNotes"
                rows={3}
                placeholder="مثال: دفع نقداً كاش / تحويل محفظة إلكترونية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-input bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-right resize-none animate-none"
              />
            </div>

            <div className="flex gap-3 justify-end border-t border-border pt-4 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseRecordModal}
                className="h-10 px-5 rounded-lg border-border text-foreground hover:bg-muted font-medium"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={handleRecordPayment}
                disabled={isRecordPending}
                className="h-10 px-6 rounded-lg flex items-center gap-2 font-bold shadow-none"
              >
                {isRecordPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    تأكيد وتسجيل الدفع
                  </>
                )}
              </Button>
            </div>
          </div>
        </SharedModal>
      )}
    </div>
  );
}
