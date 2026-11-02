'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, Ban } from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { FormTextarea } from '@/components/common/form-textarea';
import { Button } from '@/components/ui/button';
import { useCancelExtraSessionMutation } from '../hooks/mutations';
import { ExtraSessionItem, ExtraSessionDetails } from '../types';

interface CancelExtraSessionDialogProps {
  session: ExtraSessionItem | ExtraSessionDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelExtraSessionDialog({
  session,
  isOpen,
  onClose,
}: CancelExtraSessionDialogProps) {
  const [reason, setReason] = useState('');
  const [confirmRefundNotes, setConfirmRefundNotes] = useState('');
  const [refundError, setRefundError] = useState('');

  const cancelMutation = useCancelExtraSessionMutation();

  if (!session) return null;

  const paidCount = session.financialSummary?.paidCount ?? 0;
  const hasPaidStudents = paidCount > 0;

  const handleCancel = async () => {
    if (hasPaidStudents && !confirmRefundNotes.trim()) {
      setRefundError('يجب كتابة ملاحظة تأكيد معالجة المبالغ المستردة داخلياً.');
      return;
    }

    setRefundError('');
    const res = await cancelMutation.mutateAsync({
      id: session.id,
      data: {
        reason: reason.trim() || undefined,
        confirmRefundNotes: hasPaidStudents ? confirmRefundNotes.trim() : undefined,
      },
    });

    if (res.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setConfirmRefundNotes('');
    setRefundError('');
    onClose();
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="إلغاء الحصة الإضافية"
    >
      <div className="space-y-5 text-right" dir="rtl">
        {/* Warning Alert */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                تأكيد إلغاء الحصة: &quot;{session.title || 'حصة إضافية'}&quot;
              </h4>
              <p className="text-xs text-red-800/90 dark:text-red-300/90 leading-relaxed">
                سيتم تغيير حالة الحصة إلى <span className="font-bold">ملغاة</span>. لن يتم حذف سجلات الحضور أو جلسة الحضور.
              </p>
            </div>
          </div>
        </div>

        {/* Paid Students Mandatory Refund Note */}
        {hasPaidStudents && (
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold">
                تنبيه مالي: توجد مدفوعات نقدية مسجلة لـ ({paidCount}) طالب
              </span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              وفقاً للقواعد المالية، يلزم تسجيل ملاحظة داخلية توضح آلية معالجة الرسوم المدفوعة (مثل: الاسترداد نقداً للطلاب، أو ترحيلها للشهر القادم). هذه الملاحظة داخلية للمركز ولا تُرسل للأولياء.
            </p>

            <FormTextarea
              label="ملاحظة معالجة المبالغ المستردة (إلزامية)"
              placeholder="مثال: تم رد المبالغ النقدية للطلاب في مكتب الإدارة."
              value={confirmRefundNotes}
              onChange={(e) => {
                setConfirmRefundNotes(e.target.value);
                if (e.target.value.trim()) setRefundError('');
              }}
              error={refundError}
              required
            />
          </div>
        )}

        {/* Optional Cancellation Reason */}
        <FormTextarea
          label="سبب الإلغاء (اختياري - للسجلات الداخلية)"
          placeholder="مثال: اعتذار المعلم لظرف طارئ."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={cancelMutation.isPending}
            className="cursor-pointer"
          >
            تراجع
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={
              cancelMutation.isPending ||
              (hasPaidStudents && !confirmRefundNotes.trim())
            }
            className="font-bold cursor-pointer flex items-center gap-1.5"
          >
            {cancelMutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            <Ban className="size-4" />
            <span>تأكيد الإلغاء النهائي</span>
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}

