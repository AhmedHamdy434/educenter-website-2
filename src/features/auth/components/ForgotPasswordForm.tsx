"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, ArrowRight, Loader2, MailCheck } from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password-schema";
import { forgotPasswordAction } from "../actions/forgot-password";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { FadeIn } from "@/components/common/motion-wrapper";
import { handleResponseToast } from "@/lib/api/handleResponseToast";

export function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const result = await forgotPasswordAction(data);

    handleResponseToast(result);
    if (result.success) {
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
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
              استعادة كلمة المرور
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              أدخل بريدك الإلكتروني المسجل لإرسال رمز التحقق (OTP)
            </p>
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
            </div>

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="w-full py-6 font-bold flex items-center justify-center gap-2 rounded-xl shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>جاري إرسال رمز التحقق...</span>
                </>
              ) : (
                <>
                  <MailCheck className="size-5" />
                  <span>إرسال رمز التحقق</span>
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
