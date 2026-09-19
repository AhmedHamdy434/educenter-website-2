"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  isLoading = false,
  isDestructive = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const finalConfirmText = confirmLabel || confirmText || "حذف";
  const finalCancelText = cancelLabel || cancelText || "إلغاء";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity" dir="rtl">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl p-6 bg-card shadow-xl transition-all border border-border animate-in zoom-in-95 duration-200 z-10 flex flex-col gap-4 text-right">
        <div className="flex gap-4">
          <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-accent'}`}>
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-5 rounded-lg border-border text-foreground hover:bg-muted font-semibold"
          >
            {finalCancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "brand"}
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
            className="h-10 px-6 rounded-lg flex items-center gap-2 font-bold shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              finalConfirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
