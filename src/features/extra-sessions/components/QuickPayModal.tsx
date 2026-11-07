'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { ModalActions } from '@/components/common/ModalActions';
import { FormInput } from '@/components/common/form-input';
import { usePayExtraSessionStudentMutation } from '../hooks/mutations';
import { ExtraSessionParticipant } from '../types';

interface QuickPayModalProps {
  extraSessionId: string;
  participant: ExtraSessionParticipant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickPayModal({
  extraSessionId,
  participant,
  isOpen,
  onClose,
}: QuickPayModalProps) {
  const [notes, setNotes] = useState('');
  const payMutation = usePayExtraSessionStudentMutation();

  if (!participant) return null;

  const handlePay = async () => {
    const res = await payMutation.mutateAsync({
      id: extraSessionId,
      studentId: participant.studentId,
      data: { notes: notes.trim() || undefined },
    });

    if (res.success) {
      setNotes('');
      onClose();
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="تسجيل سداد رسوم الحصة الإضافية"
    >
      <div className="space-y-4 text-right" dir="rtl">
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              اسم الطالب:
            </span>
            <span className="text-sm font-bold text-foreground">
              {participant.student.user.fullName}
            </span>
          </div>

          {participant.student.code && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                كود الطالب:
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                {participant.student.code}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <span className="text-xs font-bold text-foreground">
              المبلغ المطلوب تحصيله نقداً:
            </span>
            <span className="text-base font-extrabold text-primary">
              {participant.amountDue} ج.م
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          سيتم تسجيل استلام المبلغ وتحديث حالة سداد الطالب فوريًا.
        </p>

        <FormInput
          label="ملاحظات التحصيل (اختياري)"
          placeholder="مثال: تم الاستلام في الاستقبال"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <ModalActions
          onCancel={onClose}
          onSubmit={handlePay}
          isLoading={payMutation.isPending}
          submitLabel={
            participant
              ? `تأكيد استلام ${participant.amountDue} ج.م`
              : "تأكيد الاستلام"
          }
          loadingLabel="جاري التسجيل..."
          icon={CheckCircle2}
          className="pt-3"
        />
      </div>
    </SharedModal>
  );
}
