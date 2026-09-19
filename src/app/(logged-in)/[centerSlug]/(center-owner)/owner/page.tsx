import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | مدير المركز",
};

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm">مرحباً بك في لوحة تحكم إدارة المركز التعليمي.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة لوحة التحكم</p>
      </div>
    </div>
  );
}
