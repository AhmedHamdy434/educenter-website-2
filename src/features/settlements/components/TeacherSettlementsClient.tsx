"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/common/Loading";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import {
  Wallet,
  Download,
  Search,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  Users,
} from "lucide-react";
import {
  useTeachersFinancialOverviewQuery,
  useSettlementsQuery,
} from "../hooks/queries";
import { useCompleteSettlementMutation } from "../hooks/mutations";
import { TeacherFinancialRow, SettlementRecord } from "../types";
import { TeacherFinancialsTable } from "./TeacherFinancialsTable";
import { SettlementHistoryTable } from "./SettlementHistoryTable";
import { CreateSettlementModal } from "./CreateSettlementModal";
import { SettlementDetailsModal } from "./SettlementDetailsModal";
import { CancelSettlementModal } from "./CancelSettlementModal";

export function TeacherSettlementsClient() {
  const [activeTab, setActiveTab] = useState<"teachers" | "history">("teachers");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modals state
  const [selectedTeacherForSettlement, setSelectedTeacherForSettlement] =
    useState<TeacherFinancialRow | null>(null);
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const [cancellingSettlement, setCancellingSettlement] = useState<SettlementRecord | null>(null);

  // Queries
  const {
    data: overviewData,
    isLoading: loadingOverview,
    isError: errorOverview,
    error: overviewErr,
    refetch: refetchOverview,
  } = useTeachersFinancialOverviewQuery(searchTerm);

  const {
    data: settlementsRes,
    isLoading: loadingSettlements,
    isError: errorSettlements,
    error: settlementsErr,
    refetch: refetchSettlements,
  } = useSettlementsQuery();

  const completeMutation = useCompleteSettlementMutation();

  const handleExportExcel = () => {
    // Open backend export endpoint
    window.open("/api/owner/settlements/export/excel", "_blank");
  };

  const summary = overviewData?.summary;
  const settlements = settlementsRes?.data || [];

  return (
    <div className="space-y-6 text-right pb-12">
      <PageHeader
        title="تسويات المعلمين"
        description="إدارة ومتابعة مستحقات المعلمين وإصدار التسويات المالية والتحويلات."
        icon={Wallet}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          className="gap-1.5 font-semibold"
        >
          <Download className="size-4" />
          تصدير كشف التسويات (Excel)
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="إجمالي مستحقات المعلمين"
          value={`${summary?.totalNetEarnings?.toLocaleString() ?? 0} ج.م`}
          icon={Users}
        />
        <StatCard
          label="المنصرف فعلياً للمعلمين"
          value={`${summary?.totalSettled?.toLocaleString() ?? 0} ج.م`}
          icon={CheckCircle2}
        />
        <StatCard
          label="محجوز قيد الصرف (معلق)"
          value={`${summary?.totalPending?.toLocaleString() ?? 0} ج.م`}
          icon={Clock}
        />
        <StatCard
          label="المتاح للصرف حالياً"
          value={`${summary?.totalAvailable?.toLocaleString() ?? 0} ج.م`}
          icon={ArrowDownLeft}
          variant="primary"
        />
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="flex bg-secondary/60 p-1 rounded-xl border border-border w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("teachers")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "teachers"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            نظرة عامة على المعلمين ({overviewData?.teachers?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "history"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            سجل التسويات والتحويلات ({settlements.length})
          </button>
        </div>

        {activeTab === "teachers" && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث باسم المعلم أو هاتفه..."
              className="pr-9 text-xs"
            />
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "teachers" ? (
        loadingOverview ? (
          <Loading message="جاري تحميل المستحقات المالية للمعلمين..." />
        ) : errorOverview ? (
          <QueryErrorState
            errorMessage={overviewErr instanceof Error ? overviewErr.message : "فشل جلب البيانات"}
            onRetry={refetchOverview}
          />
        ) : (
          <TeacherFinancialsTable
            teachers={overviewData?.teachers || []}
            onOpenSettlement={(teacher) => setSelectedTeacherForSettlement(teacher)}
          />
        )
      ) : loadingSettlements ? (
        <Loading message="جاري تحميل سجل التسويات..." />
      ) : errorSettlements ? (
        <QueryErrorState
          errorMessage={settlementsErr instanceof Error ? settlementsErr.message : "فشل جلب سجل التسويات"}
          onRetry={refetchSettlements}
        />
      ) : (
        <SettlementHistoryTable
          settlements={settlements}
          onViewDetails={(id) => setSelectedSettlementId(id)}
          onComplete={(id) => completeMutation.mutate(id)}
          onCancel={(settlement) => setCancellingSettlement(settlement)}
        />
      )}

      {/* Modals */}
      <CreateSettlementModal
        isOpen={!!selectedTeacherForSettlement}
        teacher={selectedTeacherForSettlement}
        onClose={() => setSelectedTeacherForSettlement(null)}
      />

      <SettlementDetailsModal
        settlementId={selectedSettlementId}
        onClose={() => setSelectedSettlementId(null)}
      />

      <CancelSettlementModal
        settlementId={cancellingSettlement?.id || null}
        settlementNumber={cancellingSettlement?.settlementNumber}
        onClose={() => setCancellingSettlement(null)}
      />
    </div>
  );
}
