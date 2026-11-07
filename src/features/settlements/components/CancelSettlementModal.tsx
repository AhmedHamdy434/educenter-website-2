"use client";

import React, { useState } from "react";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useCancelSettlementMutation } from "../hooks/mutations";

interface CancelSettlementModalProps {
  settlementId: string | null;
  settlementNumber?: string;
  onClose: () => void;
}

export function CancelSettlementModal({
  settlementId,
  settlementNumber,
  onClose,
}: CancelSettlementModalProps) {
  const [reason, setReason] = useState<string>("");
  const cancelMutation = useCancelSettlementMutation();

  if (!settlementId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    cancelMutation.mutate(
      { id: settlementId, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason("");
          onClose();
        },
      },
    );
  };

  return (
    <SharedModal
      isOpen={!!settlementId}
      onClose={onClose}
      title="إلغاء التسوية المالية المعلقة"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <div>
            هل أنت متأكد من رغبتك في إلغاء التسوية رقم{" "}
            <span className="font-bold">{settlementNumber}</span>؟ سيتم فك الحجز عن بنود المستحقات وإعادتها فورياً إلى رصيد المعلم المتاح للصرف.
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">سبب إلغاء التسوية *</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="يرجى توضيح سبب إلغاء هذه التسوية..."
            rows={3}
            required
            className="text-xs"
          />
        </div>

        <ModalActions
          onCancel={onClose}
          cancelLabel="تراجع"
          submitLabel="تأكيد إلغاء التسوية"
          loadingLabel="جاري الإلغاء..."
          variant="destructive"
          isSubmitting={cancelMutation.isPending}
          disabled={!reason.trim()}
          size="sm"
          className="pt-2"
        />
      </form>
    </SharedModal>
  );
}

