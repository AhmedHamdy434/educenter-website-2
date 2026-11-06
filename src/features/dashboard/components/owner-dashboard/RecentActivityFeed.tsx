"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, ArrowUpRight } from "lucide-react";
import { RecentActivity } from "../../types";
import Link from "next/link";
import { RecentActivityFeedSkeleton } from "./OwnerDashboardSkeleton";

interface RecentActivityFeedProps {
  activity?: RecentActivity;
  isLoading?: boolean;
}

const methodLabels: Record<string, string> = {
  CASH: "نقداً",
  BANK_TRANSFER: "تحويل بنكي",
  WALLET: "محفظة",
  POS: "POS",
};

export function RecentActivityFeed({
  activity,
  isLoading = false,
}: RecentActivityFeedProps) {
  if (isLoading || !activity) {
    return <RecentActivityFeedSkeleton />;
  }

  const { payments, settlements } = activity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
      {/* Recent Payments Card */}
      <Card className="p-5 border-border bg-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4.5 text-primary" />
            <h4 className="text-sm font-bold text-foreground">
              آخر عمليات تحصيل الاشتراكات
            </h4>
          </div>
          <Link
            href="/owner/groups"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {payments.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            لا توجد مدفوعات مسجلة حديثاً.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {payments.map((p) => (
              <div
                key={p.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-foreground">
                    {p.studentName}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{p.receiptNumber}</span>
                    <span>•</span>
                    <span>
                      {methodLabels[p.paymentMethod] || p.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-black text-sm text-primary">
                    +{p.amount.toLocaleString()} ج.م
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(p.paymentDate).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Settlements Card */}
      <Card className="p-5 border-border bg-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="size-4.5 text-amber-600" />
            <h4 className="text-sm font-bold text-foreground">
              آخر تسويات المعلمين
            </h4>
          </div>
          <Link
            href="/owner/settlements"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            سجل التسويات
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {settlements.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            لا توجد تسويات مسجلة حديثاً.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {settlements.map((s) => (
              <div
                key={s.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-foreground">
                    {s.teacherName}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{s.settlementNumber}</span>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 ${
                        s.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : s.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      }`}
                    >
                      {s.status === "COMPLETED"
                        ? "مصروفة"
                        : s.status === "PENDING"
                          ? "معلقة"
                          : "ملغاة"}
                    </Badge>
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-black text-sm text-foreground">
                    {s.amount.toLocaleString()} ج.م
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(s.settlementDate).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
