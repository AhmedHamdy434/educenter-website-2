"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useSubscriptionStore } from "../state/useSubscriptionStore";

export function SubscriptionWarningBanner() {
  const warning = useSubscriptionStore((state) => state.warning);
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;

  if (!warning) return null;

  return (
    <aside
      aria-label="تنبيه الاشتراك وفترة السماح"
      className="relative z-30 flex items-center justify-between gap-4 border-b border-amber-500/30 bg-amber-500/15 px-6 py-3 text-amber-950 dark:text-amber-200"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          <AlertTriangle className="size-4 stroke-[2.25]" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-bold text-xs sm:text-sm">
            تنبيه فترة السماح للاشتراك:
          </span>
          <span className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 font-medium">
            {warning}
          </span>
        </div>
      </div>

      <Link
        href={`/${centerSlug}/owner/subscription`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-800 shrink-0 shadow-xs"
      >
        <span>تجديد الاشتراك</span>
        <ArrowLeft className="size-3.5 rotate-180" />
      </Link>
    </aside>
  );
}
