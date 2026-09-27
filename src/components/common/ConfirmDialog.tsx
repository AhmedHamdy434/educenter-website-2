"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
        <AlertDialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-5 rounded-lg border-border text-foreground hover:bg-muted font-semibold cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "brand"}
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
            className="h-10 px-6 rounded-lg flex items-center gap-2 font-bold shadow-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

