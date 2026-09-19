export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4" dir="rtl">
      <div className="relative flex items-center justify-center mb-4">
        {/* Premium Deep Forest Spinner */}
        <div className="size-12 rounded-full border-4 border-secondary border-t-primary animate-spin" />
      </div>
      <p className="text-muted-foreground text-sm font-medium animate-pulse">جاري تحميل البيانات...</p>
    </div>
  );
}
