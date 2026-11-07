"use client";

import * as React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModalActionsProps {
  /** دالة زر الإلغاء/الإغلاق. إذا لم تُمرر، لن يتم إظهار زر الإلغاء */
  onCancel?: () => void;
  /** دالة زر التأكيد (تُستخدم عند الاعتماد على onClick خارج نماذج HTML Form) */
  onSubmit?: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;

  /** نوع الزر الرئيسي: تلقائياً "submit" إلا إذا تم تمرير onSubmit/onConfirm أو تحديده صراحة */
  type?: "submit" | "button";

  /** نصوص الأزرار */
  submitLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;

  /** نمط ونوع الزر اللوني */
  variant?: "brand" | "destructive" | "default" | "outline" | "secondary";
  cancelVariant?: "outline" | "ghost";

  /** حالات التحميل والتعطيل */
  isLoading?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;

  /** إخفاء أي من الزرين حسب الحاجة */
  hideSubmit?: boolean;
  hideCancel?: boolean;

  /** أيقونة الزر الرئيسي */
  icon?: LucideIcon | React.ReactNode;

  /** محاذاة الأزرار (الافتراضي: "end") */
  align?: "end" | "between" | "start" | "center";

  /** حجم الأزرار */
  size?: "default" | "sm" | "lg";

  /** عناصر إضافية في الفوتر (مثل نصوص مساعدة أو أزرار جانبية) */
  children?: React.ReactNode;

  /** تخصيص كلاس الحاوية */
  className?: string;
}

export function ModalActions({
  onCancel,
  onSubmit,
  onConfirm,
  type,
  submitLabel,
  confirmLabel,
  cancelLabel = "إلغاء",
  loadingLabel,
  variant = "brand",
  cancelVariant = "outline",
  isLoading = false,
  isSubmitting = false,
  disabled = false,
  submitDisabled = false,
  cancelDisabled = false,
  hideSubmit = false,
  hideCancel = false,
  icon,
  align,
  size = "default",
  children,
  className,
}: ModalActionsProps) {
  const loading = isLoading || isSubmitting;
  const isPrimaryDisabled = loading || disabled || submitDisabled;
  const primaryHandler = onSubmit || onConfirm;

  // نوع الزر الرئيسي: إذا لم يحدد، نتحقق إن كانت هناك دالة كليك فيكون button، وإلا submit للـ forms
  const buttonType = type || (primaryHandler ? "button" : "submit");

  // التسمية الرئيسية
  const activeLabel =
    submitLabel ?? confirmLabel ?? (buttonType === "submit" ? "حفظ البيانات" : "تأكيد");

  // نص التحميل الافتراضي بحسب طبيعة الزر
  const defaultLoadingText =
    loadingLabel ??
    (variant === "destructive"
      ? "جاري المعالجة..."
      : activeLabel.includes("إلغاء")
      ? "جاري الإلغاء..."
      : activeLabel.includes("حفظ") || activeLabel.includes("إضافة")
      ? "جاري الحفظ..."
      : "جاري المعالجة...");

  const alignClass = align
    ? {
        end: "justify-end",
        between: "justify-between",
        start: "justify-start",
        center: "justify-center",
      }[align]
    : children
    ? "justify-between"
    : "justify-end";

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as LucideIcon;
    return (
      <IconComponent
        className={cn(size === "sm" ? "size-3.5" : "size-4", "shrink-0")}
      />
    );
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (primaryHandler) {
      if (buttonType === "button") {
        e.preventDefault();
      }
      await primaryHandler();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border pt-4 mt-2",
        alignClass,
        className
      )}
    >
      {/* عناصر مخصصة على الطرف الآخر (إن وجدت) */}
      {children && <div className="flex items-center gap-2">{children}</div>}

      <div className="flex items-center gap-3">
        {/* زر الإلغاء / الإغلاق / التراجع */}
        {!hideCancel && onCancel && (
          <Button
            type="button"
            variant={cancelVariant}
            size={size}
            onClick={onCancel}
            disabled={loading || cancelDisabled}
            className="border-border text-foreground hover:bg-muted font-medium cursor-pointer"
          >
            {cancelLabel}
          </Button>
        )}

        {/* الزر الرئيسي */}
        {!hideSubmit && (
          <Button
            type={buttonType}
            variant={variant}
            size={size}
            onClick={handleClick}
            disabled={isPrimaryDisabled}
            className={cn(
              "font-bold shadow-none cursor-pointer flex items-center gap-1.5",
              variant === "brand" && "text-white"
            )}
          >
            {loading ? (
              <>
                <Loader2
                  className={cn(
                    size === "sm" ? "size-3.5" : "size-4",
                    "animate-spin shrink-0"
                  )}
                />
                <span>{defaultLoadingText}</span>
              </>
            ) : (
              <>
                {renderIcon()}
                <span>{activeLabel}</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

