"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { Card } from "@/components/ui/card";
import { getNotificationColumns } from "./columns";
import { useNotificationsQuery } from "../hooks/queries";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type NotificationLog } from "../types";
import { type ApiResponse } from "@/types";

interface NotificationsListClientProps {
  initialData: ApiResponse<NotificationLog[]>;
}

export function NotificationsListClient({
  initialData,
}: NotificationsListClientProps) {
  const [status, setStatus] = useState<string>("");
  const {
    params,
    setPage,
    handleSearchChange,
    handleLimitChange,
  } = useTableFilters();

  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: status || undefined,
    }),
    [params, status]
  );

  const { data, isLoading } = useNotificationsQuery(queryParams, initialData);

  const notifications = data?.data || [];
  const total = data?.meta?.total || notifications.length;
  const totalPages = data?.meta?.totalPages || 1;

  const columns = useMemo(() => getNotificationColumns(), []);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="سجل رسائل الواتساب والإشعارات"
        description="متابعة حالة الرسائل التلقائية المرسلة لأولياء الأمور والمعلمين والطلاب عبر واتساب."
        icon={MessageSquare}
      />

      {/* 2. Filters & Table */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <TableSearch
            placeholder="ابحث بالاسم أو رقم الهاتف أو محتوى الرسالة..."
            value={params.search}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3">
            <FilterDropdown
              placeholder="حالة التسليم"
              value={status}
              onChange={setStatus}
              options={[
                { label: "تم التسليم", value: "DELIVERED" },
                { label: "تم الإرسال", value: "SENT" },
                { label: "قيد الإرسال", value: "PENDING" },
                { label: "فشل الإرسال", value: "FAILED" },
              ]}
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={notifications}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لم يتم العثور على أي رسائل مسجلة في السجل حالياً."
        />
      </Card>
    </div>
  );
}
