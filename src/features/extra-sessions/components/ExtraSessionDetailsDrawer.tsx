"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  Phone,
} from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useExtraSessionDetailsQuery } from "../hooks/queries";
import { useSubscriptionStore } from "@/features/subscription/state/useSubscriptionStore";
import { QuickPayModal } from "./QuickPayModal";
import { QuickWaiveModal } from "./QuickWaiveModal";
import {
  formatCairoDate,
  formatCairoDateTime,
  formatTimeArabic,
} from "../utils/date-utils";
import {
  ExtraSessionParticipant,
  EXTRA_SESSION_TYPE_LABELS,
  EXTRA_SESSION_STATUS_LABELS,
} from "../types";

interface ExtraSessionDetailsDrawerProps {
  sessionId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExtraSessionDetailsDrawer({
  sessionId,
  isOpen,
  onClose,
}: ExtraSessionDetailsDrawerProps) {
  const router = useRouter();
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;
  const isExpired = useSubscriptionStore((state) => state.isExpired);

  const [payingParticipant, setPayingParticipant] =
    useState<ExtraSessionParticipant | null>(null);
  const [waivingParticipant, setWaivingParticipant] =
    useState<ExtraSessionParticipant | null>(null);
  const [searchStudent, setSearchStudent] = useState("");

  const {
    data: detailsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useExtraSessionDetailsQuery(
    sessionId || undefined,
    isOpen && !!sessionId,
  );

  const session = detailsResponse?.data;

  if (!sessionId) return null;

  const navigateToAttendance = () => {
    if (!session?.attendanceSession?.id || !session.groupId) return;
    router.push(
      `/${centerSlug}/owner/schedule/attendance/${session.groupId}/${session.attendanceSession.id}`,
    );
  };

  const filteredParticipants = (session?.participants || []).filter((p) => {
    if (!searchStudent.trim()) return true;
    const term = searchStudent.toLowerCase();
    const nameMatch = p.student.user.fullName.toLowerCase().includes(term);
    const codeMatch = p.student.code?.toLowerCase().includes(term);
    const phoneMatch = p.student.parentPhone?.includes(term);
    return nameMatch || codeMatch || phoneMatch;
  });

  const fin = session?.financialSummary;

  return (
    <>
      <SharedModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          session?.title ? `تفاصيل: ${session.title}` : "تفاصيل الحصة الإضافية"
        }
      >
        {isLoading ? (
          <div className="py-12">
            <Loading />
          </div>
        ) : isError || !session ? (
          <div className="py-8">
            <QueryErrorState
              title="تعذر تحميل تفاصيل الحصة الإضافية"
              error={error}
              onRetry={refetch}
              compact
            />
          </div>
        ) : (
          <div className="space-y-6 text-right" dir="rtl">
            {/* Header / Session Metadata Card */}
            <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="border-amber-400 bg-amber-50 text-amber-900 font-bold px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>
                      {EXTRA_SESSION_TYPE_LABELS[session.type] || session.type}
                    </span>
                  </Badge>

                  <Badge
                    variant="outline"
                    className={
                      session.status === "COMPLETED"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 text-xs"
                        : session.status === "CANCELED"
                          ? "border-red-300 bg-red-50 text-red-800 font-bold px-2 py-0.5 text-xs"
                          : "border-primary/30 bg-primary/5 text-primary font-bold px-2 py-0.5 text-xs"
                    }
                  >
                    <span>
                      {EXTRA_SESSION_STATUS_LABELS[session.status] ||
                        session.status}
                    </span>
                  </Badge>

                  {session.audience === "ALL_GROUP" ? (
                    <span className="text-xs text-muted-foreground font-semibold">
                      (جميع طلاب المجموعة)
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-semibold">
                      (طلاب محددون: {session.participants.length})
                    </span>
                  )}
                </div>

                {/* Shortcut to Take Attendance */}
                {session.attendanceSession?.id &&
                  session.status !== "CANCELED" && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={navigateToAttendance}
                      className="h-8 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <CalendarCheck className="size-3.5" />
                      <span>تسجيل / استكمال الحضور</span>
                    </Button>
                  )}
              </div>

              {/* Info Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {formatCairoDate(session.date).slice(0,10)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {formatTimeArabic(session.hour, session.minute)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Coins className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {Number(session.fee) > 0
                      ? `${session.fee} ج.م`
                      : "مجانية بدون رسوم"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground truncate">
                    {session.location || "غير محدد"}
                  </span>
                </div>
              </div>

              {session.notes && (
                <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground ml-1">
                    توجيهات الحصة:
                  </span>
                  <span>{session.notes}</span>
                </div>
              )}

              {session.status === "CANCELED" && (
                <div className="pt-3 border-t border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 p-3 rounded-xl space-y-1.5 text-xs">
                  {session.canceledAt && (
                    <div className="flex items-center gap-1.5 text-red-800 dark:text-red-300">
                      <span className="font-bold">تاريخ الإلغاء:</span>
                      <span>
                        {new Date(session.canceledAt).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  )}
                  {session.cancellationNotes && (
                    <div className="text-red-800 dark:text-red-300">
                      <span className="font-bold ml-1">ملاحظات الاسترداد:</span>
                      <span>{session.cancellationNotes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Financial Summary KPI Cards (If fee > 0) */}
            {fin && Number(session.fee) > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Coins className="size-3.5 text-primary" />
                  <span>الموقف المالي للحصة</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl border border-border bg-card">
                    <span className="text-[11px] text-muted-foreground font-semibold block">
                      إجمالي المطلوب
                    </span>
                    <span className="text-base font-extrabold text-foreground">
                      {fin.totalDue} ج.م
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      ({fin.studentsCount} طالب)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                      المحصل كاش
                    </span>
                    <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      {fin.totalCollected} ج.م
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block">
                      ({fin.paidCount} طالب سدد)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold block">
                      المتبقي للتحصيل
                    </span>
                    <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                      {fin.remaining} ج.م
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-500 block">
                      ({fin.unpaidCount} طالب لم يسدد)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-secondary/30">
                    <span className="text-[11px] text-muted-foreground font-semibold block">
                      الطلاب المعفون
                    </span>
                    <span className="text-base font-extrabold text-muted-foreground">
                      {fin.totalWaived} ج.م
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      ({fin.waivedCount} معفى)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Participants & Payment List */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  <span>
                    كشف الطلاب المشاركين وحالة السداد والحضور (
                    {session.participants.length})
                  </span>
                </h4>

                <input
                  type="text"
                  placeholder="بحث باسم الطالب أو الكود..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="h-8 px-3 rounded-lg border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary w-full sm:w-60"
                />
              </div>

              <div className="border border-border rounded-xl bg-card overflow-hidden">
                <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                  {filteredParticipants.length === 0 ? (
                    <EmptyState
                      title="لا يوجد طلاب يطابقون البحث"
                      description="يرجى التأكد من كتابة الاسم أو الكود بشكل صحيح."
                      compact
                    />
                  ) : (
                    filteredParticipants.map((p) => {
                      const isFeeSession = Number(session.fee) > 0;
                      const hasPaid = Number(p.paid) > 0;

                      return (
                        <div
                          key={p.id}
                          className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/20 transition-colors"
                        >
                          {/* Student Info */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">
                                {p.student.user.fullName}
                              </span>
                              {p.student.code && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                                  {p.student.code}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              {p.student.parentPhone && (
                                <span
                                  className="flex items-center gap-1"
                                  dir="ltr"
                                >
                                  <Phone className="size-3 text-muted-foreground/70" />
                                  <span>{p.student.parentPhone}</span>
                                </span>
                              )}

                              {/* Attendance Status direct from session */}
                              <div className="flex items-center gap-1">
                                {p.attendanceStatus === "PRESENT" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200">
                                    <CheckCircle2 className="size-2.5" />
                                    <span>حاضر</span>
                                  </span>
                                ) : p.attendanceStatus === "ABSENT" ? (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.2 rounded border border-red-200"
                                    title={p.absenceReason || "غائب"}
                                  >
                                    <XCircle className="size-2.5" />
                                    <span>
                                      غائب{" "}
                                      {p.absenceReason
                                        ? `(${p.absenceReason})`
                                        : ""}
                                    </span>
                                  </span>
                                ) : p.attendanceStatus === "LATE" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200">
                                    <Clock className="size-2.5" />
                                    <span>متأخر</span>
                                  </span>
                                ) : p.attendanceStatus === "EXCUSED" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded border border-blue-200">
                                    <AlertCircle className="size-2.5" />
                                    <span>عذر مقبول</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground">
                                    لم يسجل الحضور بعد
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Payment Status & Actions (Only if session has fee) */}
                          {isFeeSession ? (
                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              {hasPaid ? (
                                <div className="text-left sm:text-right">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="size-3" />
                                    <span>تم السداد: {p.paid} ج.م</span>
                                  </span>
                                  {p.paidAt && (
                                    <span className="text-[9.5px] text-muted-foreground block mt-0.5">
                                      بتاريخ {formatCairoDateTime(p.paidAt)}
                                    </span>
                                  )}
                                </div>
                              ) : p.isWaived ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200">
                                  <ShieldCheck className="size-3" />
                                  <span>معفى من الرسوم</span>
                                </span>
                              ) : session.status === "CANCELED" ? (
                                <span className="text-xs text-muted-foreground font-semibold">
                                  غير مسدد (ملغاة)
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setWaivingParticipant(p)}
                                    disabled={isExpired}
                                    className="h-7 text-[11px] px-2 cursor-pointer hover:bg-amber-50 hover:text-amber-800 border-border"
                                  >
                                    إعفاء
                                  </Button>

                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setPayingParticipant(p)}
                                    disabled={isExpired}
                                    className="h-7 text-[11px] px-2.5 font-bold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                                  >
                                    <Coins className="size-3" />
                                    <span>تحصيل {p.amountDue} ج.م</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground font-semibold">
                              حصة مجانية
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="cursor-pointer"
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </SharedModal>

      {/* Quick Cash Payment Modal */}
      <QuickPayModal
        extraSessionId={sessionId}
        participant={payingParticipant}
        isOpen={!!payingParticipant}
        onClose={() => setPayingParticipant(null)}
      />

      {/* Quick Waive Modal */}
      <QuickWaiveModal
        extraSessionId={sessionId}
        participant={waivingParticipant}
        isOpen={!!waivingParticipant}
        onClose={() => setWaivingParticipant(null)}
      />
    </>
  );
}
