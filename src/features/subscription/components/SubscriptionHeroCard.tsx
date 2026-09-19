"use client";

import { useMemo } from "react";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type CenterActiveSubscription } from "../types";
import { formatFullDate, getSubscriptionStatusDetails } from "@/utils/time";

interface SubscriptionHeroCardProps {
  subscription?: CenterActiveSubscription | null;
  centerName: string;
}

export function SubscriptionHeroCard({
  subscription,
}: SubscriptionHeroCardProps) {
  const plan = subscription?.subscriptionPlan;

  // Calculate days remaining and status
  const {
    daysRemaining,
    isExpired,
    isNearExpiry,
  } = useMemo(() => getSubscriptionStatusDetails(subscription), [subscription]);

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/25 border-r-4 border-r-primary p-6 md:p-8 shadow-none text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Right Info Zone */}
        <div className="space-y-4">
          {/* Plan Name & Center Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {plan?.name || "باقة غير محددة"}
            </h2>
            {plan?.description && (
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
                {plan.description}
              </p>
            )}
          </div>

          {/* Subscription Dates Strip */}
          {subscription && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-muted-foreground border-t border-primary/10">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary shrink-0" />
                <span>بداية الاشتراك:</span>
                <span className="font-bold text-foreground" dir="ltr">
                  {formatFullDate(subscription.startDate)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary shrink-0" />
                <span>تاريخ التجديد / الانتهاء:</span>
                <span className="font-bold text-foreground" dir="ltr">
                  {formatFullDate(subscription.endDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Left Price & Days Counter Box */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 md:border-r md:border-border/60 md:pr-8">
          {/* Price Box */}
          <div className="space-y-1 md:text-left">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                {subscription?.price || "0"}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                ج.م
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                /{" "}
                {plan?.durationInDays ? `${plan.durationInDays} يوم` : "شهرياً"}
              </span>
            </div>
          </div>

          {/* Days Left Chip */}
          <div className="mt-2">
            {isExpired ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="size-4 text-rose-600" />
                <span>انتهت صلاحية الاشتراك</span>
              </div>
            ) : (
              <div
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isNearExpiry
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-secondary border-border text-foreground"
                }`}
              >
                <Clock className="size-4 text-primary" />
                <span>
                  متبقي على التجديد:{" "}
                  <strong className="font-black text-primary">
                    {daysRemaining}
                  </strong>{" "}
                  يوم
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
