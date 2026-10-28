"use client";
import { cn } from "@/lib/utils";
import { CalendarCheck2, CreditCard, TrendingUp, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GroupDetailsTabs() {
  const tabs = [
    { id: "students", label: "الطلاب المسجلون", Icon: Users },
    { id: "attendance", label: "تحضير الحضور والغياب", Icon: CalendarCheck2 },
    { id: "reports", label: "تقارير نسب الحضور", Icon: TrendingUp },
    { id: "payments", label: "الاشتراكات والمدفوعات", Icon: CreditCard },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "students";

  const handleTab = (selectedTab: string) => {
    const params = new URLSearchParams();
    params.set("tab", selectedTab);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border py-2 text-nowrap">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleTab(id)}
          aria-current={tab === id ? "page" : undefined}
          className={cn(
            "mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors",
            tab === id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
