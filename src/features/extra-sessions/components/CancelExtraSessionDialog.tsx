'use client';

import { useState } from 'react';
import { AlertTriangle, Ban } from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { ModalActions } from '@/components/common/ModalActions';
import { FormTextarea } from '@/components/common/form-textarea';
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
              label="ملاحظة معالجة المبالغ المستردة"
              placeholder="أدخل ملاحظات تسوية المبالغ المستردة..."
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
          label="سبب الإلغاء"
          placeholder="أدخل سبب إلغاء الحصة الإضافية..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Action Buttons */}
        <ModalActions
          onCancel={handleClose}
          onSubmit={handleCancel}
          cancelLabel="تراجع"
          submitLabel="تأكيد الإلغاء النهائي"
          loadingLabel="جاري الإلغاء..."
          variant="destructive"
          isLoading={cancelMutation.isPending}
          disabled={hasPaidStudents && !confirmRefundNotes.trim()}
          icon={Ban}
          className="pt-3"
        />
      </div>
    </SharedModal>
  );
}

