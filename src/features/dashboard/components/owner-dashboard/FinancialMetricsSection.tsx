"use client";

import { Card } from "@/components/ui/card";
import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import {
  DollarSign,
  TrendingUp,
  RotateCcw,
  Users,
  Building2,
  CheckCircle2,
  Wallet,
  Clock,
} from "lucide-react";
import { FinancialMetrics } from "../../types";
import { FinancialMetricsSkeleton } from "./OwnerDashboardSkeleton";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface FinancialMetricsSectionProps {
  metrics?: FinancialMetrics;
  isLoading?: boolean;
}

const periods = [
  { key: "today", label: "اليوم" },
  { key: "week", label: "آخر 7 أيام" },
  { key: "month", label: "هذا الشهر" },
  { key: "year", label: "هذا العام" },
  { key: "all", label: "جميع الفترات" },
];

export function FinancialMetricsSection({
  metrics,
  isLoading = false,
}: FinancialMetricsSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "month";

  const cards = [
    {
      label: "إجمالي الإيرادات المحصلة",
      value: metrics?.collectedRevenue,
      icon: TrendingUp,
      variant: "primary",
      unit: "ج.م",
    },

    {
      label: "إجمالي المبالغ المستردة (Refunds)",
      value: metrics?.totalRefunds,
      icon: RotateCcw,
      unit: "ج.م",
    },
    {
      label: "صافي المقبوضات النقدية",
      value: metrics?.netCollectedRevenue,
      icon: CheckCircle2,
      unit: "ج.م",
    },
    {
      label: "مستحقات المعلمين المحتسبة",
      value: metrics?.teacherNetEarnings,
      icon: Users,
      unit: "ج.م",
    },
    {
      label: " حصة السنتر الإجمالية",
      value: metrics?.centerGrossShare,
      icon: Building2,
      unit: "ج.م",
      textClassName: "text-amber-600",
    },
    {
      label: "المنصرف الفعلي للمعلمين",
      value: metrics?.settledPayouts,
      icon: Wallet,
      unit: "ج.م",
    },
  ];

  const standingCards = [
    {
      label: "التزامات المعلمين غير المصروفة",
      value: metrics?.outstandingTeacherLiabilities,
      className: "text-rose-600",
    },
    {
      label: "مستحقات الاشتراكات على الطلاب",
      value: metrics?.outstandingStudentReceivables,
      className: "text-primary",
    },
    {
      label: "أرصدة الطلاب الدائنة (غير المخصصة)",
      value: metrics?.studentCreditBalances,
      className: "text-amber-600",
    },
  ];

  const handlePeriodChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", key);
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
  return (
    <div className="space-y-4">
      {/* Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            المؤشرات المالية للفترة المحددة
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            تحليل دقيق للإيرادات المحصلة وتوزيع العوائد ومستحقات المعلمين.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-secondary/60 p-1 rounded-xl border border-border">
          {periods.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => handlePeriodChange(p.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === p.key
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gross Collected */}
        {cards.map(({ label, value, icon, variant, unit, textClassName }) =>
          isLoading ? (
            <StatCardSkeleton key={label} />
          ) : (
            <StatCard
              key={label}
              label={label}
              value={value}
              icon={icon}
              variant={variant === "primary" ? "primary" : "default"}
              unit={unit}
              textClassName={textClassName}
            />
          ),
        )}
      </div>

      {/* Permanent Center Standing (Cumulative Liabilities & Receivables) */}
      <Card className="p-4 bg-secondary/30 border-border rounded-xl">
        <div className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          الأرصدة التراكمية المركزية (الذمم والمستحقات الحالية):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {standingCards.map(({ label, value, className }) =>
            isLoading ? (
              <FinancialMetricsSkeleton key={label} />
            ) : (
              <div
                key={label}
                className="bg-card p-3 rounded-lg border border-border"
              >
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className={cn("text-lg font-black mt-1", className)}>
                  {value} <span className="text-xs font-normal">ج.م</span>
                </div>
              </div>
            ),
          )}
        </div>
      </Card>
    </div>
  );
}
