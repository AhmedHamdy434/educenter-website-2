"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4"
      dir="rtl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary border border-border mb-6">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">
        الصفحة غير موجودة
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التأكد من
        الرابط والمحاولة مجدداً.
      </p>
      <Button
        asChild
        variant="brand"
        size="brandMd"
        className="font-bold shadow-none"
      >
        <Link href={`/${centerSlug}`}>العودة للوحة التحكم</Link>
      </Button>
    </div>
  );
}
