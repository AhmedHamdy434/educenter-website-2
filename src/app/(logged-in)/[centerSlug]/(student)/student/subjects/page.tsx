import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "موادي الدراسية | الطالب",
};

export default function StudentSubjectsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">موادي الدراسية</h1>
        <p className="text-muted-foreground text-sm">عرض المواد الدراسية المسجل بها وجداول الحصص.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة موادي الدراسية</p>
      </div>
    </div>
  );
}
