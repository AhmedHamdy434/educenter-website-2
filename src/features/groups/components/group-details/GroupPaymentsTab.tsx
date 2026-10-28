"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  CheckCircle,
  Loader2,
  Users,
  AlertCircle,
  Landmark,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharedModal } from "@/components/common/SharedModal";
import { SharedTable } from "@/components/common/SharedTable";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { StatCard } from "@/components/common/StatCard";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useGroupPaymentsQuery } from "../../hooks/queries";
import { usePayGroupStudentMonthMutation } from "../../hooks/mutations";
import {
  type GroupStudentPaymentInfo,
  type GroupPaymentsQueryParams,
} from "../../types";
import { formatMonthName } from "@/utils/time";
import { getGroupPaymentsColumns } from "./group-payments-columns";

interface GroupPaymentsTabProps {
  groupId: string;
}

interface PaymentFilters {
  month?: string;
}

export function GroupPaymentsTab({ groupId }: GroupPaymentsTabProps) {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
    month,
  } = useTableFilters<PaymentFilters>();

  const queryParams: GroupPaymentsQueryParams = useMemo(
    () => ({
      page,
      limit,
      search,
      month,
      sortBy: sortBy as GroupPaymentsQueryParams["sortBy"],
      sortOrder,
    }),
    [page, limit, search, month, sortBy, sortOrder],
  );

  const { data: paymentsRes, isLoading: isPaymentsLoading } =
    useGroupPaymentsQuery(groupId, queryParams);

  const stats = paymentsRes?.stats;

  const availableMonths = useMemo(
    () => stats?.groupMonths ?? [],
    [stats?.groupMonths],
  );

  const defaultMonth = useMemo(() => {
    if (availableMonths.length === 0) return "";
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    return availableMonths.includes(todayStr) ? todayStr : availableMonths[0];
  }, [availableMonths]);

  const activeMonth = month || defaultMonth;

  const payments = paymentsRes?.data || [];
  const meta = paymentsRes?.meta;
  const totalRecords = meta?.total ?? 0;

  // حالة مودال تسجيل الدفع
  const [selectedStudent, setSelectedStudent] =
    useState<GroupStudentPaymentInfo | null>(null);
  const [notes, setNotes] = useState("");

  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  const handleOpenRecordModal = useCallback(
    (student: GroupStudentPaymentInfo) => {
      setSelectedStudent(student);
      setNotes("");
    },
    [],
  );

  const handleCloseRecordModal = useCallback(() => {
    setSelectedStudent(null);
    setNotes("");
  }, []);

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

  const handleMonthChange = (newMonth: string) => {
    updateQuery({ month: newMonth || undefined });
  };

  // تعريف أعمدة الـ SharedTable
  const columns = useMemo(
    () =>
      getGroupPaymentsColumns({
        page,
        limit,
        activeMonth,
        onRecordPayment: handleOpenRecordModal,
      }),
    [page, limit, activeMonth, handleOpenRecordModal],
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header Toolbar: Month Filter + Backend TableSearch */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="size-5 text-primary shrink-0" />
          <label className="text-sm font-bold text-foreground shrink-0">
            الشهر المستهدف:
          </label>
          <FilterDropdown
            value={activeMonth}
            onChange={handleMonthChange}
            placeholder="اختر الشهر المستهدف..."
            options={availableMonths.map((m) => ({
              value: m,
              label: formatMonthName(m),
            }))}
            className="w-full sm:w-56"
          />
        </div>

        <div className="w-full sm:w-72">
          <TableSearch placeholder="ابحث باسم الطالب، الهاتف أو الكود..." />
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="إجمالي الطلاب"
          value={stats?.total ?? 0}
          unit="طالب"
          icon={Users}
        />
        <StatCard
          label="المسددون"
          value={stats?.paid ?? 0}
          unit="طالب"
          icon={CheckCircle}
        />
        <StatCard
          label="المتبقون"
          value={stats?.unpaid ?? 0}
          unit="طالب"
          icon={AlertCircle}
        />
        <StatCard
          label="الإيراد المتوقع"
          value={Number(stats?.expected ?? 0).toFixed(2)}
          unit="ج.م"
          icon={Landmark}
        />
        <StatCard
          label="الإيراد المحصل"
          value={Number(stats?.collected ?? 0).toFixed(2)}
          unit="ج.م"
          icon={CreditCard}
          variant="primary"
        />
      </div>

      {/* 3. Total Records Counter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-4.5 text-primary" />
          <h2 className="font-bold text-foreground text-sm">
            كشف اشتراكات الطلاب ({totalRecords})
          </h2>
        </div>
      </div>

      {/* 4. Server-driven SharedTable */}
      <SharedTable
        columns={columns}
        data={payments}
        isLoading={isPaymentsLoading}
        meta={meta}
        sorting={sorting}
        onSortingChange={onSortingChange}
        emptyMessage={
          search
            ? "لا يوجد طلاب يطابقون معايير البحث في هذا الشهر."
            : "لا توجد بيانات اشتراكات مسجلة لهذا الشهر."
        }
      />

      {/* 5. Record Payment Modal Dialog */}
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
                  {selectedStudent.studentInfo?.fullName}
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
                  {Number(selectedStudent.monthlyFee || 0).toFixed(2)} ج.م
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
                className="h-10 px-5 rounded-lg border-border text-foreground hover:bg-muted font-medium cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={handleRecordPayment}
                disabled={isRecordPending}
                className="h-10 px-6 rounded-lg flex items-center gap-2 font-bold shadow-none cursor-pointer"
              >
                {isRecordPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>جاري التسجيل...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    <span>تأكيد وتسجيل الدفع</span>
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
