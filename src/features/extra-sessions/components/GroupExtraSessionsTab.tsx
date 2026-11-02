"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CalendarCheck,
  Edit,
  Ban,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/common/Loading";
import { TableSearch } from "@/components/common/TableSearch";
import { useGroupExtraSessionsQuery } from "../hooks/queries";
import { CreateExtraSessionModal } from "./CreateExtraSessionModal";
import { EditExtraSessionModal } from "./EditExtraSessionModal";
import { CancelExtraSessionDialog } from "./CancelExtraSessionDialog";
import { ExtraSessionDetailsDrawer } from "./ExtraSessionDetailsDrawer";
import { ExtraSessionsStats } from "./ExtraSessionsStats";
import { formatCairoDate, formatTimeArabic } from "../utils/date-utils";
import { ExtraSessionItem, EXTRA_SESSION_STATUS_LABELS } from "../types";

interface GroupExtraSessionsTabProps {
  groupId: string;
}

export function GroupExtraSessionsTab({ groupId }: GroupExtraSessionsTabProps) {
  const router = useRouter();
  const params = useParams<{ centerSlug: string }>();
  const searchParams = useSearchParams();
  const centerSlug = params?.centerSlug;

  const search = searchParams.get("search") || "";

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExtraSessionItem | null>(
    null,
  );
  const [cancelingSession, setCancelingSession] =
    useState<ExtraSessionItem | null>(null);
  const [detailsSessionId, setDetailsSessionId] = useState<string | null>(null);

  const { data: response, isLoading } = useGroupExtraSessionsQuery(groupId, {
    search,
    limit: 50,
  });

  const sessions = response?.data || [];

  const navigateToAttendance = (session: ExtraSessionItem) => {
    if (!session.attendanceSession?.id) return;
    router.push(
      `/${centerSlug}/owner/schedule/attendance/${groupId}/${session.attendanceSession.id}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Overview */}
      <ExtraSessionsStats sessions={sessions} />

      {/* Toolbar / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <TableSearch
              placeholder="بحث بعنوان الحصة أو الملاحظات..."
              className="max-w-sm"
            />
          </div>
        </div>

        {/* Create Extra Session Action */}
        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-4 font-bold text-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Sparkles className="size-4" />
          <span>حصة إضافية جديدة</span>
        </Button>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="py-16">
          <Loading />
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-card space-y-3">
          <Sparkles className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-sm font-bold text-foreground">
            لا توجد حصص إضافية مسجلة
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            يمكنك إنشاء حصة إضافية للمجموعة لأي غرض (مراجعة، تعويض، ليلة امتحان)
            سواء كانت مجانية أو برسوم كاش.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isCompleted = session.status === "COMPLETED";
            const isCanceled = session.status === "CANCELED";
            const feeNum = Number(session.fee) || 0;
            const finSummary = session.financialSummary;

            return (
              <div
                key={session.id}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Session Main Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-extrabold text-foreground truncate">
                      {session.title || "حصة إضافية"}
                    </h4>

                    <Badge
                      variant="outline"
                      className={
                        isCompleted
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 text-[11px]"
                          : isCanceled
                            ? "border-red-300 bg-red-50 text-red-800 font-bold px-2 py-0.5 text-[11px]"
                            : "border-primary/30 bg-primary/5 text-primary font-bold px-2 py-0.5 text-[11px]"
                      }
                    >
                      <span>
                        {EXTRA_SESSION_STATUS_LABELS[session.status] ||
                          session.status}
                      </span>
                    </Badge>

                    {feeNum > 0 ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {feeNum} ج.م / طالب
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        مجانية
                      </span>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary/70" />
                      <span>{formatCairoDate(session.date).slice(0, 10)}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary/70" />
                      <span>
                        {formatTimeArabic(session.hour, session.minute)}
                      </span>
                    </span>

                    {session.location && (
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-primary/70" />
                        <span>{session.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Financial & Attendance Snapshot */}
                  {feeNum > 0 && finSummary && (
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <span className="text-muted-foreground">
                        التحصيل:{" "}
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {finSummary.totalCollected} ج.م
                        </span>{" "}
                        من {finSummary.totalDue} ج.م ({finSummary.paidCount}/
                        {finSummary.studentsCount} طالب)
                      </span>

                      {finSummary.waivedCount > 0 && (
                        <span className="text-muted-foreground">
                          • معفون: {finSummary.waivedCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Session Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                  {/* View Details / Drawer */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailsSessionId(session.id)}
                    className="h-8 px-2.5 text-xs font-bold cursor-pointer hover:bg-secondary flex items-center gap-1.5 border-border"
                  >
                    <Eye className="size-3.5" />
                    <span>التفاصيل والطلاب</span>
                  </Button>

                  {/* Attendance Shortcut */}
                  {session.attendanceSession?.id && !isCanceled && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => navigateToAttendance(session)}
                      className="h-8 px-2.5 text-xs font-bold cursor-pointer flex items-center gap-1.5 border border-border"
                    >
                      <CalendarCheck className="size-3.5 text-primary" />
                      <span>{isCompleted ? "عرض الحضور" : "تسجيل الحضور"}</span>
                    </Button>
                  )}

                  {/* Edit (Only if not completed or canceled) */}
                  {!isCompleted && !isCanceled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSession(session)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="تعديل الحصة"
                    >
                      <Edit className="size-3.5" />
                    </Button>
                  )}

                  {/* Cancel (Only if not already canceled or completed) */}
                  {!isCanceled && !isCompleted && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelingSession(session)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title="إلغاء الحصة"
                    >
                      <Ban className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      <CreateExtraSessionModal
        groupId={groupId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditExtraSessionModal
        session={editingSession}
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
      />

      <CancelExtraSessionDialog
        session={cancelingSession}
        isOpen={!!cancelingSession}
        onClose={() => setCancelingSession(null)}
      />

      <ExtraSessionDetailsDrawer
        sessionId={detailsSessionId}
        isOpen={!!detailsSessionId}
        onClose={() => setDetailsSessionId(null)}
      />
    </div>
  );
}
