"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { SubscriptionHealth } from "../../types";
import Link from "next/link";
import { SubscriptionHeroBannerSkeleton } from "./OwnerDashboardSkeleton";

interface SubscriptionHeroBannerProps {
  subscription?: SubscriptionHealth | null;
  isLoading: boolean;
}

export function SubscriptionHeroBanner({
  subscription,
  isLoading,
}: SubscriptionHeroBannerProps) {
  return (
    <Card className="relative overflow-hidden border-border bg-linear-to-br from-card via-card to-primary/5 p-6 shadow-xs">
      {/* Top Banner Row */}
      {isLoading || !subscription ? (
        <SubscriptionHeroBannerSkeleton />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-6 stroke-[2.25]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-foreground">
                    خطة الاشتراك: {subscription.planName}
                  </h2>
                  {subscription.isGracePeriod ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1"
                    >
                      <AlertTriangle className="size-3" />
                      مهلة سماح ({subscription.remainingGraceDays} يوم متبقي)
                    </Badge>
                  ) : subscription.status === "EXPIRED" ? (
                    <Badge variant="destructive">منتهي الصلاحية</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    >
                      نشط
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ينتهي الاشتراك في:{" "}
                  {new Date(subscription.endDate).toLocaleDateString("ar-EG")} (
                  {subscription.daysRemaining > 0
                    ? `${subscription.daysRemaining} يوم متبقي`
                    : "انتهى"}
                  )
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/owner/subscription">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-bold"
                >
                  إدارة الاشتراك والفوترة
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
          {/* Grace Period Alert */}
          {subscription.isGracePeriod && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Clock className="size-4 shrink-0" />
              <span>
                تنبيه: اشتراك المركز في فترة السماح المؤقتة. يرجى تجديد الاشتراك
                خلال{" "}
                <span className="font-bold underline">
                  {subscription.remainingGraceDays} أيام
                </span>{" "}
                لتجنب إيقاف إضافة الطلاب والمعلمين.
              </span>
            </div>
          )}
          {/* Quotas Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* Student Quota */}
            <div className="space-y-2 bg-secondary/30 p-3.5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  حصة الطلاب المستهلكة
                </span>
                <span className="font-extrabold text-foreground">
                  {subscription.studentQuota.current} /{" "}
                  {subscription.studentQuota.limit}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({subscription.studentQuota.usagePercent}%)
                  </span>
                </span>
              </div>
              <Progress
                value={subscription.studentQuota.usagePercent}
                className="h-2"
              />
            </div>

            {/* Teacher Quota */}
            <div className="space-y-2 bg-secondary/30 p-3.5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-primary" />
                  حصة المعلمين المستهلكة
                </span>
                <span className="font-extrabold text-foreground">
                  {subscription.teacherQuota.current} /{" "}
                  {subscription.teacherQuota.limit}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({subscription.teacherQuota.usagePercent}%)
                  </span>
                </span>
              </div>
              <Progress
                value={subscription.teacherQuota.usagePercent}
                className="h-2"
              />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
