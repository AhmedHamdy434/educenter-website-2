"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  CheckCircle,
  Users,
  AlertCircle,
  Landmark,
  CreditCard,
} from "lucide-react";
import { SharedTable } from "@/components/common/SharedTable";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useGroupPaymentsQuery } from "../../hooks/queries";
import { useSubscriptionStore } from "@/features/subscription/state/useSubscriptionStore";
import {
  type GroupStudentPaymentInfo,
  type GroupPaymentsQueryParams,
  GroupPaymentsStats,
} from "../../types";
import { formatMonthName } from "@/utils/time";
import { getGroupPaymentsColumns } from "./group-payments-columns";
import { RecordGroupPaymentModal } from "./RecordGroupPaymentModal";

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
      month: month || undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, search, month, sortBy, sortOrder],
  );

  const {
    data: paymentsRes,
    isLoading: isPaymentsLoading,
    isError,
    error,
    refetch,
  } = useGroupPaymentsQuery(groupId, queryParams);

  console.log("d", paymentsRes);
  const stats = paymentsRes?.stats as GroupPaymentsStats;

  const availableMonths = stats?.groupMonths ?? [];

  const activeMonth = month ?? stats?.activeMonth ?? "";

  const payments = paymentsRes?.data || [];
  const meta = paymentsRes?.meta;
  const totalRecords = meta?.total ?? 0;

  // حالة اشتراك المركز
  const isExpired = useSubscriptionStore((state) => state.isExpired);

  // حالة مودال تسجيل الدفع
  const [selectedStudent, setSelectedStudent] =
    useState<GroupStudentPaymentInfo | null>(null);

  const handleOpenRecordModal = useCallback(
    (student: GroupStudentPaymentInfo) => {
      if (isExpired) return;
      setSelectedStudent(student);
    },
    [isExpired],
  );

  const handleCloseRecordModal = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  const handleMonthChange = (newMonth: string) => {
    updateQuery({ month: newMonth || undefined, page: 1 });
  };

  // تعريف أعمدة الـ SharedTable
  const columns = useMemo(
    () =>
      getGroupPaymentsColumns({
        page,
        limit,
        activeMonth,
        isExpired,
        onRecordPayment: handleOpenRecordModal,
      }),
    [page, limit, activeMonth, isExpired, handleOpenRecordModal],
  );

  const cards = [
    {
      label: "إجمالي الطلاب",
      value: stats?.total,
      unit: "طالب",
      icon: Users,
    },
    {
      label: "المسددون",
      value: stats?.paid,
      unit: "طالب",
      icon: CheckCircle,
    },
    {
      label: "المتبقون",
      value: stats?.unpaid,
      unit: "طالب",
      icon: AlertCircle,
    },
    {
      label: "الإيراد المتوقع",
      value: stats?.expected,
      unit: "ج.م",
      icon: Landmark,
    },
    {
      label: "الإيراد المحصل",
      value: stats?.collected,
      unit: "ج.م",
      icon: CreditCard,
      variant: "primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar: Month Filter + Backend TableSearch */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
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
            className="w-full lg:w-56"
          />
        </div>

        <div className="w-full md:w-72">
          <TableSearch placeholder="ابحث باسم الطالب، الهاتف أو الكود..." />
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ label, value, unit, icon, variant }) =>
          isPaymentsLoading ? (
            <StatCardSkeleton key={label} />
          ) : (
            <StatCard
              key={label}
              label={label}
              value={value}
              unit={unit}
              icon={icon}
              variant={variant === "primary" ? "primary" : "default"}
            />
          ),
        )}
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
        isError={isError}
        error={error}
        onRetry={refetch}
        meta={meta}
        sorting={sorting}
        onSortingChange={onSortingChange}
        emptyTitle={
          search
            ? "لا يوجد طلاب يطابقون معايير البحث في هذا الشهر"
            : "لا توجد بيانات اشتراكات مسجلة لهذا الشهر"
        }
        emptyDescription={
          search
            ? "تأكد من اسم الطالب المسجل أو حاول البحث في شهر آخر."
            : "لم يتم تسجيل أو تحصيل أي اشتراكات للطلاب في هذا الشهر حتى الآن."
        }
        emptyIcon={CreditCard}
      />

      {/* 5. Record Payment Modal Dialog */}
      <RecordGroupPaymentModal
        isOpen={!!selectedStudent}
        onClose={handleCloseRecordModal}
        student={selectedStudent}
        activeMonth={activeMonth}
        isExpired={isExpired}
      />
    </div>
  );
}
