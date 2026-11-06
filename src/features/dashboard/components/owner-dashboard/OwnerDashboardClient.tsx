"use client";

import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useOwnerDashboardQuery } from "../../hooks/queries";
import { SubscriptionHeroBanner } from "./SubscriptionHeroBanner";
import { OperationalStatsGrid } from "./OperationalStatsGrid";
import { FinancialMetricsSection } from "./FinancialMetricsSection";
import { RecentActivityFeed } from "./RecentActivityFeed";
import { useSearchParams } from "next/navigation";

export function OwnerDashboardClient() {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "month";

  const { data, isLoading, isError, error, refetch } = useOwnerDashboardQuery({
    period,
  });

  const stats = data?.data;

  if (isError || (!stats && !isLoading)) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }

  return (
    <>
      {/* Subscription Hero Banner */}
      <SubscriptionHeroBanner
        subscription={stats?.subscriptionHealth}
        isLoading={isLoading}
      />

      {/* Operational Stats Grid */}
      <OperationalStatsGrid
        stats={stats?.operationalStats}
        isLoading={isLoading}
      />

      {/* Financial Metrics Section */}
      <FinancialMetricsSection
        metrics={stats?.financialMetrics}
        isLoading={isLoading}
      />

      {/* Recent Activity Streams */}
      <RecentActivityFeed
        activity={stats?.recentActivity}
        isLoading={isLoading}
      />
    </>
  );
}
