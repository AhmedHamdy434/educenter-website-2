'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { FormInput } from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
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
          label="سبب الإعفاء (اختياري)"
          placeholder="مثال: منحة تفوق، ظرف خاص بقرار الإدارة"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={waiveMutation.isPending}
            className="cursor-pointer"
          >
            إلغاء
          </Button>

          <Button
            type="button"
            onClick={handleWaive}
            disabled={waiveMutation.isPending}
            className="font-bold cursor-pointer flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {waiveMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            <span>تأكيد الإعفاء</span>
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}

