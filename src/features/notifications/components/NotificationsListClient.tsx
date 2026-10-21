"use client";

import { useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { Card } from "@/components/ui/card";
import { getNotificationColumns } from "./columns";
import { useNotificationsQuery } from "../hooks/queries";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type NotificationLog, type NotificationFilterParams } from "../types";
import { type ApiResponse } from "@/types";

interface NotificationFilters {
  status?: string;
  type?: string;
}

interface NotificationsListClientProps {
  initialData: ApiResponse<NotificationLog[]>;
}

export function NotificationsListClient({
  initialData,
}: NotificationsListClientProps) {
  const {
    page,
    limit,
    search,
    status,
    type,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<NotificationFilters>();

  const queryParams: NotificationFilterParams = {
    page,
    limit,
    search,
    status,
    type,
    sortBy,
    sortOrder,
  };

  const { data, isLoading } = useNotificationsQuery(queryParams, initialData);

  const notifications = data?.data || [];

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
          <TableSearch placeholder="ابحث بالاسم أو رقم الهاتف أو محتوى الرسالة..." />
          <div className="flex items-center gap-3">
            <FilterDropdown
              placeholder="حالة التسليم"
              value={status || ""}
              onChange={(val) =>
                updateQuery({
                  status: val || undefined,
                  page: 1,
                })
              }
              options={[
                { label: "تم التسليم", value: "DELIVERED" },
                { label: "تم الإرسال", value: "SENT" },
                { label: "قيد الإرسال", value: "PENDING" },
                { label: "فشل الإرسال", value: "FAILED" },
              ]}
              allOptionLabel="كل الحالات"
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={notifications}
          isLoading={isLoading}
          meta={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي رسائل مسجلة في السجل حالياً."
        />
      </Card>
    </div>
  );
}

