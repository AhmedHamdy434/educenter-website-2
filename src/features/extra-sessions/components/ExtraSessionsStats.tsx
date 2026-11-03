import { ExtraSessionsGroupStats } from "../types";

interface ExtraSessionsStatsProps {
  stats?: ExtraSessionsGroupStats;
}

export const ExtraSessionsStats = ({ stats }: ExtraSessionsStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl border border-border bg-card">
        <span className="text-xs text-muted-foreground font-semibold block">
          إجمالي الحصص الإضافية
        </span>
        <span className="text-xl font-extrabold text-foreground">
          {stats?.totalSessions}
        </span>
        <span className="text-[11px] text-muted-foreground block mt-0.5">
          حصة مسجلة للمجموعة
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
        <span className="text-xs text-primary font-semibold block">
          الحصص القادمة (المجدولة)
        </span>
        <span className="text-xl font-extrabold text-primary">
          {stats?.scheduledSessions}
        </span>
        <span className="text-[11px] text-muted-foreground block mt-0.5">
          بانتظار الانعقاد
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
        <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">
          الحصص المكتملة
        </span>
        <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
          {stats?.completedSessions}
        </span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-500 block mt-0.5">
          تم تسجيل حضورها
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
        <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block">
          إجمالي الرسوم المحصلة
        </span>
        <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
          {stats?.totalCollected} ج.م
        </span>
        <span className="text-[11px] text-amber-600 dark:text-amber-500 block mt-0.5">
          مدفوعات كاش
        </span>
      </div>
    </div>
  );
};
