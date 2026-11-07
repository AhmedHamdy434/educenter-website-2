"use client";

import { AlertTriangle } from "lucide-react";
import { ModalActions } from "@/components/common/ModalActions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
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
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
  isLoading = false,
  isDestructive = true,
}: ConfirmDialogProps) {

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <div className="flex gap-4">
            <div
              className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                isDestructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-accent"
              }`}
            >
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1.5">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Action Buttons */}
        <ModalActions
          onCancel={onClose}
          onConfirm={onConfirm}
          isLoading={isLoading}
          variant={isDestructive ? "destructive" : "brand"}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          loadingLabel="جاري المعالجة..."
          className="border-t-0 pt-2 mt-2"
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

