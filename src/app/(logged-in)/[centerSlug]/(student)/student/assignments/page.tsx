import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الواجبات | الطالب",
};

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">واجباتي</h1>
        <p className="text-muted-foreground text-sm">عرض الواجبات المدرسية المطلوبة وحالة تسليمها.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة واجباتي والأنشطة</p>
      </div>
    </div>
  );
}
