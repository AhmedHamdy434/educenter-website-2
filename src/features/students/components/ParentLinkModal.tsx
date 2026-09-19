"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SharedModal } from "@/components/common/SharedModal";
import { type Student } from "../types";
import { generateParentLinkAction } from "../actions/students-actions";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageSquare, Loader2, Link2, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ParentLinkModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentLinkModal({
  student,
  isOpen,
  onClose,
}: ParentLinkModalProps) {
  const [copied, setCopied] = useState(false);

  const studentId = student?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-magic-link", studentId],
    queryFn: () => generateParentLinkAction(studentId!),
    enabled: isOpen && !!studentId,
    staleTime: 1000 * 60 * 5,
  });

  if (!student) return null;

  const token = data?.data?.token;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const magicUrl = token ? `${origin}/p/${token}` : "";

  const handleCopy = () => {
    if (!magicUrl) return;
    navigator.clipboard.writeText(magicUrl);
    setCopied(true);
    toast.success("تم نسخ رابط تقرير ولي الأمر بنجاح!");
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = (student.parentPhone || student.user.phone || "").replace(
    /[^0-9]/g,
    ""
  );
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
    `السلام عليكم ولي أمر الطالب ${student.user.fullName}،\nيمكنكم متابعة تقرير الحضور والغياب والمدفوعات الدراسية مباشرة عبر هذا الرابط السري (صالح لمدة 30 يوماً):\n${magicUrl}`
  )}`;

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="رابط تقرير ولي الأمر (Magic Link)"
    >
      <div className="space-y-5 text-right" dir="rtl">
        {/* Info Card */}
        <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-foreground">
              الطالب: {student.user.fullName}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {student.parentPhone ? `ولي الأمر: ${student.parentPhone}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5 text-accent" />
            <span>الرابط سري ومخصص وصالح للاستخدام لمدة 30 يوماً دون الحاجة لكلمة مرور.</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
            <Loader2 className="size-7 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              جاري توليد الرابط السحري لولي الأمر...
            </span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>فشل توليد رابط ولي الأمر. يرجى المحاولة لاحقاً.</span>
          </div>
        )}

        {/* Generated Link Display */}
        {!isLoading && token && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Link2 className="size-3.5 text-primary" />
                رابط التقرير المباشر:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={magicUrl}
                  className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-mono text-foreground outline-none text-left dir-ltr"
                />
                <Button
                  onClick={handleCopy}
                  variant="brand"
                  size="sm"
                  className="gap-1.5 text-xs font-bold rounded-lg shrink-0 px-4"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* WhatsApp Share Button */}
            {cleanPhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 text-xs sm:text-sm transition-colors shadow-none"
              >
                <MessageSquare className="size-4" />
                <span>إرسال التقرير لولي الأمر عبر واتساب</span>
              </a>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border">
              <ShieldCheck className="size-3.5 text-emerald-700 shrink-0" />
              <span>
                يمكن لولي الأمر فتح هذا التقرير من أي هاتف للاطلاع على نسب الحضور والغياب، المجموعات المسجل بها، وحالة دفع الاشتراكات الشهرية.
              </span>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button onClick={onClose} variant="outline" size="sm" className="rounded-lg text-xs">
            إغلاق
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}
