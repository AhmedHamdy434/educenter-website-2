"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Loading } from "@/components/common/Loading";
import { useAttendanceSessionDetailsQuery } from "@/features/attendance/hooks/queries";
import { useSaveAttendanceMutation } from "@/features/attendance/hooks/mutations";
import { AttendanceStatus, SessionStudent } from "@/features/attendance/types";

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
}

export function AttendanceRecorder({
  groupId,
  sessionId,
  onBack,
}: AttendanceRecorderProps) {
  // 1. Fetch Session details (includes student list and their saved status)
  const { data: response, isLoading } = useAttendanceSessionDetailsQuery(
    groupId,
    sessionId,
  );

  const saveMutation = useSaveAttendanceMutation();

  const rawStudentList = response?.data?.students;
  const studentList = useMemo(
    () => rawStudentList || [],
    [rawStudentList],
  );
  const sessionData = response?.data?.session;

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

    return {
      ...student,
      status,
      absenceReason,
      localRecordedAt,
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

    // Immediate local state update
    setRecords((prev) => ({
      ...prev,
      [student.studentId]: {
        status: targetStatus,
        reason: "",
        localRecordedAt: timeStr,
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

        return {
          ...prev,
          [studentId]: {
            status,
            reason,
            localRecordedAt:
              prev[studentId]?.localRecordedAt || getCurrentTimeFormatted(),
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [studentList],
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
    const payloadRecords = studentList.map((student) => {
      const local = records[student.studentId];
      const effectiveStatus =
        local?.status ?? student.status ?? AttendanceStatus.ABSENT;
      const reason = local?.reason ?? student.absenceReason ?? "";

      return {
        studentId: student.studentId,
        status: effectiveStatus,
        absenceReason:
          effectiveStatus === AttendanceStatus.ABSENT ||
          effectiveStatus === AttendanceStatus.ATTENDED_ANOTHER_GROUP
            ? reason || undefined
            : undefined,
      };
    });

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
    return <Loading message="جاري تحميل كشف طلاب الحصة..." />;
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
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
          <p className="font-bold text-foreground text-sm">
            لا يوجد طلاب مقيدون في هذه المجموعة الدراسية بعد.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            أضف طلاباً للمجموعة لتتمكن من تسجيل الحضور والغياب.
          </p>
        </div>
      )}
    </div>
  );
}
