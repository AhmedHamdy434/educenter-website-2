"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, ArrowRight, Loader2, KeyRound, Clock } from "lucide-react";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password-schema";
import { resetPasswordAction } from "../actions/reset-password";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { FadeIn } from "@/components/common/motion-wrapper";
import { handleResponseToast } from "@/lib/api/handleResponseToast";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  // 10-minute OTP countdown (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const result = await resetPasswordAction(data);

    handleResponseToast(result);
    if (result.success) {
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <FadeIn direction="up" duration={0.6}>
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-none">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary border border-border">
                <GraduationCap className="size-6 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                EduCenter
              </span>
            </Link>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              تعيين كلمة المرور الجديدة
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              أدخل رمز التحقق (OTP) المكون من 6 أرقام وكلمة المرور الجديدة
            </p>

            {/* OTP Countdown Badge */}
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 mt-2">
              <Clock className="size-3.5" />
              <span>صلاحية الرمز تنتهي خلال:</span>
              <span className="font-mono text-sm">{formattedTime}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                type="email"
                id="email"
                label="البريد الإلكتروني"
                placeholder="user@example.com"
                className="text-left dir-ltr"
                error={errors.email?.message}
                disabled={isSubmitting}
                {...register("email")}
              />

              <FormInput
                type="text"
                id="otp"
                label="رمز التحقق (OTP)"
                placeholder="123456"
                maxLength={6}
                className="text-center tracking-widest font-mono text-lg"
                error={errors.otp?.message}
                disabled={isSubmitting}
                {...register("otp")}
              />

              <FormInput
                type="password"
                id="newPassword"
                label="كلمة المرور الجديدة"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                disabled={isSubmitting}
                {...register("newPassword")}
              />

              <FormInput
                type="password"
                id="confirmPassword"
                label="تأكيد كلمة المرور الجديدة"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
                {...register("confirmPassword")}
              />
            </div>

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting || timeLeft <= 0}
              className="w-full py-6 font-bold flex items-center justify-center gap-2 rounded-xl shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>جاري تعيين كلمة المرور...</span>
                </>
              ) : (
                <>
                  <KeyRound className="size-5" />
                  <span>حفظ كلمة المرور الجديدة</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer Back to Login */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-bold transition-colors group"
            >
              <ArrowRight className="size-3.5 group-hover:-translate-x-1 transition-transform rotate-180" />
              <span>العودة لتسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
