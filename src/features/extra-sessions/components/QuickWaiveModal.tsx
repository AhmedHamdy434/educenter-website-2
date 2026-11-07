'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { ModalActions } from '@/components/common/ModalActions';
import { FormInput } from '@/components/common/form-input';
import { useWaiveExtraSessionStudentMutation } from '../hooks/mutations';
import { ExtraSessionParticipant } from '../types';

interface QuickWaiveModalProps {
  extraSessionId: string;
  participant: ExtraSessionParticipant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickWaiveModal({
  extraSessionId,
  participant,
  isOpen,
  onClose,
}: QuickWaiveModalProps) {
  const [reason, setReason] = useState('');
  const waiveMutation = useWaiveExtraSessionStudentMutation();

  if (!participant) return null;

  const handleWaive = async () => {
    const res = await waiveMutation.mutateAsync({
      id: extraSessionId,
      studentId: participant.studentId,
      data: { reason: reason.trim() || undefined },
    });

    if (res.success) {
      setReason('');
      onClose();
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="إعفاء الطالب من رسوم الحصة الإضافية"
    >
      <div className="space-y-4 text-right" dir="rtl">
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              اسم الطالب:
            </span>
            <span className="text-sm font-bold text-foreground">
              {participant.student.user.fullName}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-amber-900/60">
            <span className="text-xs font-bold text-foreground">
              المبلغ المعفى:
            </span>
            <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
              {participant.amountDue} ج.م
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          سيتم إعفاء الطالب رسمياً من سداد هذه الرسوم، ولن تظهر كمتأخرات في ملخص الحصة المالي.
        </p>

        <FormInput
          label="سبب الإعفاء"
          placeholder="أدخل سبب إعفاء الطالب من الرسوم..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <ModalActions
          onCancel={onClose}
          onSubmit={handleWaive}
          isLoading={waiveMutation.isPending}
          submitLabel="تأكيد الإعفاء"
          loadingLabel="جاري الإعفاء..."
          icon={ShieldCheck}
          className="pt-3"
        />
      </div>
    </SharedModal>
  );
}

