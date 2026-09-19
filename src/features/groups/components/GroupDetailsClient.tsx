"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Users, CalendarCheck2, TrendingUp, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroupQuery } from "../hooks/queries";
import {
  useAddStudentsToGroupMutation,
  useRemoveStudentsFromGroupMutation,
} from "../hooks/mutations";
import { GroupDetailsHeader } from "./group-details/GroupDetailsHeader";
import { GroupInfoSidebar } from "./group-details/GroupInfoSidebar";
import { EnrolledStudentsList } from "./group-details/EnrolledStudentsList";
import { AddStudentsModal } from "./group-details/AddStudentsModal";
import { AttendanceTab } from "./group-details/AttendanceTab";
import { AttendanceReportsTab } from "./group-details/AttendanceReportsTab";
import { GroupPaymentsTab } from "./group-details/GroupPaymentsTab";
import { StudentPaymentsModal } from "@/features/students/components/StudentPaymentsModal";
import { type GroupDetails } from "../types";
import { type ApiResponse, UserRole } from "@/types";

interface GroupDetailsClientProps {
  initialGroupData: ApiResponse<GroupDetails>;
  userRole: UserRole;
}

export function GroupDetailsClient({
  initialGroupData,
  userRole,
}: GroupDetailsClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentHistoryStudent, setPaymentHistoryStudent] = useState<{
    id: string;
    name: string;
    groupStudentId?: string;
  } | null>(null);

  const isOwner = userRole === UserRole.OWNER;
  const isTeacher = userRole === UserRole.TEACHER;

  // Read active tab from URL query params
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "attendance" ||
    tabParam === "reports" ||
    tabParam === "students" ||
    tabParam === "payments"
      ? (tabParam as "students" | "attendance" | "reports" | "payments")
      : "students";

  const [activeTab, setActiveTab] = useState<
    "students" | "attendance" | "reports" | "payments"
  >(initialTab);

  // 1. Fetch Group Details with React Query
  const { data: groupResponse } = useGroupQuery(initialGroupData.data.id, true);

  const group = groupResponse?.data || initialGroupData.data;

  // 2. Mutations
  const { mutateAsync: addStudents, isPending: isAddPending } =
    useAddStudentsToGroupMutation();
  const { mutateAsync: removeStudent, isPending: isRemovePending } =
    useRemoveStudentsFromGroupMutation();

  // Memoize enrolled student IDs to check against candidates
  const enrolledStudentIds = useMemo(() => {
    return new Set(group.students.map((s) => s.student.id));
  }, [group.students]);

  // 3. Handlers
  const handleRemoveStudent = async (studentId: string) => {
    await removeStudent({
      id: group.id,
      studentIds: [studentId],
    });
  };

  const handleAddStudents = async (
    studentIds: string[],
    subscriptionStartDate?: string
  ) => {
    await addStudents(
      {
        id: group.id,
        studentIds,
        subscriptionStartDate,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setIsAddModalOpen(false);
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header & Actions */}
      <GroupDetailsHeader
        groupName={group.name}
        isActive={group.isActive}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        showAddButton={isOwner && activeTab === "students"}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right 2 cols: Dynamic Tabs content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Selector Bar */}
          <div className="flex border-b border-border gap-6">
            <button
              onClick={() => setActiveTab("students")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 -mb-px cursor-pointer",
                activeTab === "students"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="size-4" />
              <span>الطلاب المسجلون</span>
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 -mb-px cursor-pointer",
                activeTab === "attendance"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarCheck2 className="size-4" />
              <span>تحضير الحضور والغياب</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 -mb-px cursor-pointer",
                activeTab === "reports"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <TrendingUp className="size-4" />
              <span>تقارير نسب الحضور</span>
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 -mb-px cursor-pointer",
                activeTab === "payments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <CreditCard className="size-4" />
              <span>الاشتراكات والمدفوعات</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="min-h-100">
            {activeTab === "students" && (
              <EnrolledStudentsList
                students={group.students}
                onRemoveStudent={handleRemoveStudent}
                isRemovePending={isRemovePending}
                showRemoveButton={isOwner}
                onViewPayments={(studentId, studentName, groupStudentId) =>
                  setPaymentHistoryStudent({
                    id: studentId,
                    name: studentName,
                    groupStudentId,
                  })
                }
              />
            )}

            {activeTab === "attendance" && (
              <AttendanceTab
                groupId={group.id}
                totalStudents={group.students.length}
              />
            )}

            {activeTab === "reports" && (
              <AttendanceReportsTab groupId={group.id} />
            )}

            {activeTab === "payments" && (
              <GroupPaymentsTab groupId={group.id} />
            )}
          </div>
        </div>

        {/* Left 1 col: Sidebar Metadata */}
        <div>
          <GroupInfoSidebar group={group} isTeacher={isTeacher} />
        </div>
      </div>

      {/* Add Students Dialog Modal */}
      {!isTeacher && (
        <AddStudentsModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          gradeId={group.gradeId}
          gradeName={group.grade.name}
          enrolledStudentIds={enrolledStudentIds}
          onAddStudents={handleAddStudents}
          isAddPending={isAddPending}
        />
      )}

      {/* Student Payments History Modal with Pay Capability */}
      {paymentHistoryStudent && (
        <StudentPaymentsModal
          isOpen={!!paymentHistoryStudent}
          onClose={() => setPaymentHistoryStudent(null)}
          studentId={paymentHistoryStudent.id}
          studentName={paymentHistoryStudent.name}
          groupId={group.id}
          groupStudentId={paymentHistoryStudent.groupStudentId}
          monthlyFee={Number(group.monthlyFee)}
          startDate={group.startDate}
          monthsCount={group.monthsCount}
        />
      )}
    </div>
  );
}
