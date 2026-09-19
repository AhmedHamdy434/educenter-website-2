"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { SharedTable } from "@/components/common/SharedTable";
import { Card } from "@/components/ui/card";
import { getAuditLogColumns } from "./columns";
import { AuditLogDetailsModal } from "./AuditLogDetailsModal";
import { useAuditLogsQuery } from "../hooks/queries";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type AuditLog } from "../types";
import { type ApiResponse } from "@/types";

interface AuditLogsListClientProps {
  initialData: ApiResponse<AuditLog[]>;
}

export function AuditLogsListClient({ initialData }: AuditLogsListClientProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const {
    params,
    setPage,
    handleSearchChange,
    handleLimitChange,
  } = useTableFilters();

  const { data, isLoading } = useAuditLogsQuery(params, initialData);

  const logs = data?.data || [];
  const total = data?.meta?.total || logs.length;
  const totalPages = data?.meta?.totalPages || 1;

  const columns = useMemo(
    () =>
      getAuditLogColumns({
        onViewDetails: (log) => setSelectedLog(log),
      }),
    []
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="سجل العمليات والتدقيق (Audit Logs)"
        description="سجل زمني لجميع العمليات الإدارية والأمنية المنفذة داخل المركز التعليمي."
        icon={History}
      />

      {/* 2. Filters & Table */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <TableSearch
            placeholder="ابحث في سجل العمليات..."
            value={params.search}
            onChange={handleSearchChange}
          />
        </div>

        <SharedTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لا توجد عمليات مسجلة في سجل التدقيق حالياً."
        />
      </Card>

      {/* 3. Details Modal */}
      <AuditLogDetailsModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
