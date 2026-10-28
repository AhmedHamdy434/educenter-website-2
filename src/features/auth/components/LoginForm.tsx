"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";

import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import { loginAction } from "../actions/login";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { FadeIn } from "@/components/common/motion-wrapper";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearErrors("root");

    const result = await loginAction(data);

    if (result.success) {
      if (result.data?.mustChangePassword) {
        router.push("/change-password");
      } else {
        router.push(
          `/${result.data?.user?.center?.slug}/${result.data?.user.role?.toLowerCase()}`,
        );
      }
    } else {
      toast.error(result?.message || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <FadeIn direction="up" duration={0.6}>
        {/* Card Container */}
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
              تسجيل الدخول للمنصة
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              أدخل بريدك الإلكتروني أو رقم الهاتف للمتابعة
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Identifier Input */}
              <FormInput
                type="text"
                id="identifier"
                label="البريد الإلكتروني أو رقم الهاتف"
                placeholder="user@educenter.com أو 01xxxxxxxxx"
                className="text-left dir-ltr"
                error={errors.identifier?.message}
                disabled={isSubmitting}
                {...register("identifier")}
              />

              {/* Password Input & Forgot Link */}
              <div className="space-y-1.5">
                <div className="relative">
                  <FormInput
                    type="password"
                    id="password"
                    label="كلمة المرور"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary/80 hover:text-primary font-semibold transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="w-full py-6 font-bold flex items-center justify-center gap-2 rounded-xl shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-bold transition-colors group"
            >
              <ArrowRight className="size-3.5 group-hover:-translate-x-1 transition-transform rotate-180" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
