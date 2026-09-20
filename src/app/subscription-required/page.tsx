import type { Metadata } from "next";
import { ShieldAlert, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { SubscriptionRequiredClient } from "./SubscriptionRequiredClient";

export const metadata: Metadata = {
  title: "اشتراك المركز غير مفعل",
  description: "اشتراك المركز التابع له هذا الحساب غير نشط حالياً أو انتهت فترة صلاحيته.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionRequiredPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-background text-foreground relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      {/* Header / Logo */}
      <header className="mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary border border-border transition-transform group-hover:scale-105">
            <GraduationCap className="size-6 relative z-10" />
            <BookOpen className="size-4 absolute bottom-1.5 left-1.5 opacity-40" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-bold tracking-tight text-foreground">
              EduCenter
            </span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-1">
              منصة مراكز التعليم
            </span>
          </div>
        </Link>
      </header>

      {/* Main Card */}
      <section
        aria-labelledby="subscription-required-title"
        className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center relative z-10"
      >
        <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 border border-amber-500/20">
          <ShieldAlert className="size-8" />
        </div>

        <h1
          id="subscription-required-title"
          className="text-2xl font-bold text-foreground mb-3"
        >
          اشتراك المركز غير مفعل
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          عذراً، اشتراك المركز التابع له هذا الحساب غير نشط حالياً أو انتهت فترة صلاحيته.
          يرجى التواصل مع إدارة المركز لتجديد الاشتراك ومتابعة استخدام المنصة.
        </p>

        <SubscriptionRequiredClient />
      </section>

      {/* Footer copyright */}
      <footer className="mt-8 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} EduCenter. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}
