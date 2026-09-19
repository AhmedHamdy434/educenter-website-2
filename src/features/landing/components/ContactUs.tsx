"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { FormSelect } from "@/components/common/form-select";
import { FormTextarea } from "@/components/common/form-textarea";
import { FadeIn, ScaleIn } from "@/components/common/motion-wrapper";
import {
  contactSchema,
  type ContactFormValues,
} from "../schemas/contact-schema";

export function ContactUs() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "استفسار عام",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    clearErrors("root");
    console.log("Contact form submitted:", data);
    setIsSuccess(true);
    reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "support@educenter.com",
    },
    {
      icon: Phone,
      label: "خدمة العملاء والواتساب",
      value: "+20 100 000 0000",
      dir: "ltr",
    },
    {
      icon: MapPin,
      label: "المقر الرئيسي",
      value: "القاهرة، جمهورية مصر العربية",
    },
  ];

  return (
    <section id="contact" className="w-full py-20 bg-background border-t border-border" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn
          direction="up"
          duration={0.5}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold border border-border">
            تواصل معنا
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            هل لديك أي استفسار؟ نحن هنا للمساعدة
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            فريق الدعم الفني والمبيعات جاهز للرد على جميع أسئلتكم على مدار الساعة
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Right Column: Contact Form */}
          <FadeIn
            direction="right"
            delay={0.1}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-none">
              <h3 className="text-xl font-bold text-foreground mb-6">
                أرسل لنا رسالة مباشرة
              </h3>

              {isSuccess ? (
                <ScaleIn className="flex flex-col items-center text-center p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-4">
                  <CheckCircle2 className="size-16 text-emerald-600" />
                  <h4 className="text-lg font-bold text-emerald-800">
                    تم الإرسال بنجاح!
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md font-medium">
                    تم إرسال رسالتك بنجاح! نسعد بتواصلك وسنقوم بالرد عليك في أقرب وقت.
                  </p>
                  <Button
                    variant="brand"
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 font-bold shadow-none"
                  >
                    إرسال رسالة جديدة
                  </Button>
                </ScaleIn>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {errors.root && (
                    <ScaleIn className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                      <AlertTriangle className="size-5 shrink-0 text-destructive" />
                      <span>{errors.root.message}</span>
                    </ScaleIn>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <FormInput
                      type="text"
                      id="name"
                      label="الاسم الكامل"
                      {...register("name")}
                      placeholder="أدخل اسمك الكريم"
                      error={errors.name?.message}
                    />

                    {/* Email Input */}
                    <FormInput
                      type="email"
                      id="email"
                      label="البريد الإلكتروني"
                      {...register("email")}
                      placeholder="name@example.com"
                      className="text-left dir-ltr"
                      error={errors.email?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Input */}
                    <FormInput
                      type="tel"
                      id="phone"
                      label="رقم الهاتف"
                      {...register("phone")}
                      placeholder="01xxxxxxxxx"
                      className="text-left dir-ltr"
                      error={errors.phone?.message}
                    />

                    {/* Subject Select */}
                    <FormSelect
                      name="subject"
                      control={control}
                      label="موضوع الرسالة"
                      placeholder="اختر موضوع الرسالة"
                      options={[
                        { value: "استفسار عام", label: "استفسار عام" },
                        { value: "طلب تجربة باقة", label: "طلب تجربة باقة" },
                        { value: "مشكلة تقنية", label: "مشكلة تقنية" },
                        { value: "اقتراحات وتطوير", label: "اقتراحات وتطوير" },
                      ]}
                      error={errors.subject?.message}
                    />
                  </div>

                  {/* Message Input */}
                  <FormTextarea
                    id="message"
                    label="نص الرسالة"
                    {...register("message")}
                    placeholder="اكتب استفسارك أو رسالتك بالتفصيل هنا..."
                    className="resize-none min-h-32"
                    error={errors.message?.message}
                  />

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
                        <span>جاري إرسال رسالتك...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4 rotate-180" />
                        <span>إرسال الرسالة</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Left Column: Visual Information & Info Badges */}
          <FadeIn
            direction="left"
            delay={0.2}
            className="lg:col-span-5 flex flex-col justify-between space-y-8"
          >
            {/* Visual Image container */}
            <div className="relative hidden lg:block w-full aspect-16/10 lg:aspect-square rounded-2xl overflow-hidden shadow-none border border-border bg-card min-h-62.5 lg:min-h-87.5">
              <Image
                src="/images/contact-illustration.png"
                alt="تواصل معنا - EduCenter"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </div>

            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 border border-border text-right"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary border border-border shadow-none">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground">
                        {item.label}
                      </h4>
                      <p
                        className="text-sm font-bold text-foreground mt-0.5"
                        dir={"dir" in item ? item.dir : undefined}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
