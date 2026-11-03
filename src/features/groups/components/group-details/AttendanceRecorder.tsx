"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useAttendanceSessionDetailsQuery } from "@/features/attendance/hooks/queries";
import { useSaveAttendanceMutation } from "@/features/attendance/hooks/mutations";
import {
  AttendanceStatus,
  SessionStudent,
  AttendanceRecordInput,
} from "@/features/attendance/types";

import { AttendanceSessionStats } from "./attendance/AttendanceSessionStats";
import { AttendanceScannerBar } from "./attendance/AttendanceScannerBar";
import { AttendancePresentList } from "./attendance/AttendancePresentList";
import { AttendancePendingList } from "./attendance/AttendancePendingList";

interface AttendanceRecorderProps {
  groupId: string;
  sessionId: string;
  onBack: () => void;
}

interface LocalRecord {
  status: AttendanceStatus | null;
  reason: string;
  localRecordedAt?: string;
  paid?: number;
  isWaived?: boolean;
  paymentNotes?: string;
}

export function AttendanceRecorder({
  groupId,
  sessionId,
  onBack,
}: AttendanceRecorderProps) {
  // 1. Fetch Session details (includes student list and their saved status)
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useAttendanceSessionDetailsQuery(groupId, sessionId);

  const saveMutation = useSaveAttendanceMutation();

  const rawStudentList = response?.data?.students;
  const studentList = useMemo(() => rawStudentList || [], [rawStudentList]);
  const sessionData = response?.data?.session;
  const isExtraSession = Boolean(sessionData?.extraSessionId);

  // Local state to track modified attendance records locally
  const [records, setRecords] = useState<Record<string, LocalRecord>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [highlightedStudentId, setHighlightedStudentId] = useState<
    string | null
  >(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format current Arabic time for display
  const getCurrentTimeFormatted = () => {
    return new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Merge server student list with local modifications
  const mergedStudents = studentList.map((student) => {
    const local = records[student.studentId];
    const status = local !== undefined ? local.status : student.status;
    const absenceReason =
      local !== undefined ? local.reason : student.absenceReason || "";
    const localRecordedAt = local?.localRecordedAt;
    const localPaid = local?.paid;
    const localIsWaived = local?.isWaived;
    const localPaymentNotes = local?.paymentNotes;

    return {
      ...student,
      status,
      absenceReason,
      localRecordedAt,
      localPaid,
      localIsWaived,
      localPaymentNotes,
    };
  });

  // Partition into Present / Recorded and Not Yet Recorded
  const presentStudents = mergedStudents.filter((s) => s.status !== null);
  const pendingStudents = mergedStudents.filter((s) => s.status === null);

  // Derived statistics (calculated directly on the fly)
  const totalStudents = studentList.length;
  const presentCount = mergedStudents.filter(
    (s) =>
      s.status === AttendanceStatus.PRESENT ||
      s.status === AttendanceStatus.LATE ||
      s.status === AttendanceStatus.ATTENDED_ANOTHER_GROUP,
  ).length;
  const attendedAnotherGroupCount = mergedStudents.filter(
    (s) => s.status === AttendanceStatus.ATTENDED_ANOTHER_GROUP,
  ).length;
  const unrecordedCount = pendingStudents.length;
  const absentCount = mergedStudents.filter(
    (s) => s.status === AttendanceStatus.ABSENT,
  ).length;
  const excusedCount = mergedStudents.filter(
    (s) => s.status === AttendanceStatus.EXCUSED,
  ).length;

  // Flash highlight on newly registered student
  const triggerHighlight = (studentId: string) => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    setHighlightedStudentId(studentId);
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedStudentId(null);
    }, 2500);
  };

  // 100% Local Attendance Recording (Scanner, Search, Quick Present) - No network request!
  const handleRecordStudent = (
    student: SessionStudent,
    targetStatus: AttendanceStatus = AttendanceStatus.PRESENT,
  ) => {
    const timeStr = getCurrentTimeFormatted();

    let initialPaid =
      records[student.studentId]?.paid ??
      (student.extraSessionInfo?.paid !== null &&
      student.extraSessionInfo?.paid !== undefined
        ? Number(student.extraSessionInfo.paid)
        : undefined);
    const initialWaived =
      records[student.studentId]?.isWaived ??
      student.extraSessionInfo?.isWaived ??
      false;
    const initialPaymentNotes =
      records[student.studentId]?.paymentNotes ??
      (student.extraSessionInfo?.notes || undefined);

    // If extra session and targetStatus is PRESENT or LATE: suggest amountDue if not paid and not waived
    if (
      isExtraSession &&
      (targetStatus === AttendanceStatus.PRESENT ||
        targetStatus === AttendanceStatus.LATE)
    ) {
      const amountDue = student.extraSessionInfo?.amountDue ?? 0;
      if (initialPaid === undefined && !initialWaived) {
        initialPaid = amountDue;
      }
    }

    // Immediate local state update
    setRecords((prev) => ({
      ...prev,
      [student.studentId]: {
        status: targetStatus,
        reason: prev[student.studentId]?.reason || "",
        localRecordedAt: timeStr,
        paid: initialPaid,
        isWaived: initialWaived,
        paymentNotes: initialPaymentNotes,
      },
    }));
    setHasUnsavedChanges(true);
    triggerHighlight(student.studentId);
    toast.success(`تم تحضير الطالب: ${student.fullName}`);
  };

  // Status Change for already recorded students - Local only!
  const handleStatusChange = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      setRecords((prev) => {
        const student = studentList.find((s) => s.studentId === studentId);
        const currentReason =
          prev[studentId]?.reason ?? student?.absenceReason ?? "";
        const reason =
          status === AttendanceStatus.ABSENT ||
          status === AttendanceStatus.ATTENDED_ANOTHER_GROUP
            ? currentReason
            : "";

        let paid =
          prev[studentId]?.paid ??
          (student?.extraSessionInfo?.paid !== null &&
          student?.extraSessionInfo?.paid !== undefined
            ? Number(student?.extraSessionInfo.paid)
            : undefined);
        const isWaived =
          prev[studentId]?.isWaived ??
          student?.extraSessionInfo?.isWaived ??
          false;
        const paymentNotes =
          prev[studentId]?.paymentNotes ??
          (student?.extraSessionInfo?.notes || undefined);

        if (
          isExtraSession &&
          (status === AttendanceStatus.PRESENT ||
            status === AttendanceStatus.LATE)
        ) {
          const amountDue = student?.extraSessionInfo?.amountDue ?? 0;
          if (paid === undefined && !isWaived) {
            paid = amountDue;
          }
        }

        return {
          ...prev,
          [studentId]: {
            status,
            reason,
            localRecordedAt:
              prev[studentId]?.localRecordedAt || getCurrentTimeFormatted(),
            paid,
            isWaived,
            paymentNotes,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [studentList, isExtraSession],
  );

  // Reason Change for ABSENT status - Local only!
  const handleReasonChange = useCallback(
    (studentId: string, reason: string) => {
      setRecords((prev) => {
        const current = prev[studentId];
        const student = studentList.find((s) => s.studentId === studentId);
        const status =
          current?.status ?? student?.status ?? AttendanceStatus.ABSENT;

        return {
          ...prev,
          [studentId]: {
            status,
            reason,
            localRecordedAt: current?.localRecordedAt,
            paid: current?.paid,
            isWaived: current?.isWaived,
            paymentNotes: current?.paymentNotes,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [studentList],
  );

  // Payment Change for extra sessions - Local only!
  const handlePaymentChange = useCallback(
    (
      studentId: string,
      paid?: number,
      isWaived?: boolean,
      paymentNotes?: string,
    ) => {
      setRecords((prev) => {
        const current = prev[studentId];
        const student = studentList.find((s) => s.studentId === studentId);
        const status =
          current?.status ?? student?.status ?? AttendanceStatus.PRESENT;

        return {
          ...prev,
          [studentId]: {
            ...current,
            status,
            reason: current?.reason ?? student?.absenceReason ?? "",
            paid: paid !== undefined ? paid : current?.paid,
            isWaived: isWaived !== undefined ? isWaived : current?.isWaived,
            paymentNotes:
              paymentNotes !== undefined ? paymentNotes : current?.paymentNotes,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [studentList],
  );

  // Undo / Reset a student back to pending - Local only!
  const handleResetStudent = useCallback((studentId: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        status: null,
        reason: "",
        paid: undefined,
        isWaived: undefined,
        paymentNotes: undefined,
      },
    }));
    setHasUnsavedChanges(true);
    toast.info("تمت إزالة الطالب من قائمة الحاضرين محلياً");
  }, []);

  // Save all records to backend (Complete Roster Batch Commit)
  const handleSaveAll = async () => {
    if (studentList.length === 0) {
      toast.warning("لا يوجد طلاب في هذه المجموعة لحفظ حضورهم.");
      return;
    }

    // Build the complete list for all students:
    // Any student who was not scanned or marked gets marked as ABSENT
    const payloadRecords: AttendanceRecordInput[] = studentList.map(
      (student) => {
        const local = records[student.studentId];
        const effectiveStatus =
          local?.status ?? student.status ?? AttendanceStatus.ABSENT;
        const reason = local?.reason ?? student.absenceReason ?? "";

        const record: AttendanceRecordInput = {
          studentId: student.studentId,
          status: effectiveStatus,
          absenceReason: reason,
        };

        if (isExtraSession) {
          const paid =
            local?.paid !== undefined
              ? local.paid
              : student.extraSessionInfo?.paid !== null &&
                  student.extraSessionInfo?.paid !== undefined
                ? Number(student.extraSessionInfo.paid)
                : undefined;
          const isWaived =
            local?.isWaived !== undefined
              ? local.isWaived
              : student.extraSessionInfo?.isWaived;
          const paymentNotes =
            local?.paymentNotes !== undefined
              ? local.paymentNotes
              : (student.extraSessionInfo?.notes || undefined);

          if (paid !== undefined) record.paid = paid;
          if (isWaived !== undefined) record.isWaived = isWaived;
          if (paymentNotes !== undefined) record.paymentNotes = paymentNotes;
        }

        return record;
      },
    );

    await saveMutation.mutateAsync(
      {
        groupId,
        sessionId,
        data: { records: payloadRecords },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setRecords({});
            setHasUnsavedChanges(false);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-right animate-fade-in" dir="rtl">
        {/* Header Skeleton */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        {/* Scanner Bar Skeleton */}
        <Skeleton className="h-14 w-full rounded-xl" />

        {/* Table Rows Skeleton */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>
          <div className="border border-border rounded-xl p-4 space-y-3 bg-secondary/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8.5 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-44 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8">
        <QueryErrorState
          title="تعذر تحميل تفاصيل جلسة الحضور"
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* 1. Header & Dynamic Progress Stats */}
      <AttendanceSessionStats
        sessionDate={sessionData?.date}
        totalStudents={totalStudents}
        presentCount={presentCount}
        unrecordedCount={unrecordedCount}
        absentCount={absentCount}
        excusedCount={excusedCount}
        attendedAnotherGroupCount={attendedAnotherGroupCount}
        isSaving={saveMutation.isPending}
        hasUnsavedChanges={hasUnsavedChanges}
        onBack={onBack}
        onSaveAll={handleSaveAll}
      />

      {totalStudents > 0 ? (
        <>
          {/* 2. Fast Attendance Bar: Barcode / QR Scanner + Manual Search */}
          <AttendanceScannerBar
            students={mergedStudents}
            isProcessing={false}
            onStudentRecorded={(student) =>
              handleRecordStudent(student, AttendanceStatus.PRESENT)
            }
          />

          {/* 3. Section A: Present / Recorded Students */}
          <AttendancePresentList
            students={presentStudents}
            highlightedStudentId={highlightedStudentId}
            onStatusChange={handleStatusChange}
            onReasonChange={handleReasonChange}
            onResetStudent={handleResetStudent}
            isExtraSession={isExtraSession}
            onPaymentChange={handlePaymentChange}
          />

          {/* 4. Section B: Not Yet Recorded Students */}
          <AttendancePendingList
            students={pendingStudents}
            isProcessingId={null}
            onQuickPresent={(student) =>
              handleRecordStudent(student, AttendanceStatus.PRESENT)
            }
            onQuickStatusChange={(student, status) =>
              handleRecordStudent(student, status)
            }
          />
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="لا يوجد طلاب مقيدون في هذه المجموعة الدراسية بعد"
          description="أضف وقيد طلاباً للمجموعة لتتمكن من تسجيل الحضور والغياب."
          className="border border-dashed border-border rounded-xl bg-secondary/20 py-12"
        />
      )}
    </div>
  );
}