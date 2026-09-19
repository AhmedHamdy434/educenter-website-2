"use client";

import {
  BookOpen,
  GraduationCap,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { type GroupDetails } from "../../types";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface GroupInfoSidebarProps {
  group: GroupDetails;
  isTeacher: boolean;
}

export function GroupInfoSidebar({ group, isTeacher }: GroupInfoSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Card 1: Main Info */}
      <Card className="p-6 border border-border bg-card shadow-none space-y-4 rounded-xl">
        <h3 className="font-bold text-foreground text-sm border-b border-border pb-3 flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <span>بيانات المجموعة الأساسية</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">المرحلة الدراسية:</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <GraduationCap className="size-3.5 text-muted-foreground" />
              {group.grade.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">المادة الدراسية:</span>
            <span className="font-bold text-foreground">{group.subject.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">الطلاب المسجلون:</span>
            <span className="font-bold text-foreground">
              {group.students.length} {group.capacity ? `من أصل ${group.capacity}` : "طالب"}
            </span>
          </div>

          {!isTeacher && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">سعر الاشتراك الشهري:</span>
                <span className="font-bold text-primary bg-secondary px-2.5 py-1 rounded-md text-xs border border-border">
                  {group.monthlyFee} ج.م
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">تاريخ البداية:</span>
                <span className="font-bold text-foreground">
                  {group.startDate
                    ? new Date(group.startDate).toLocaleDateString("ar-EG")
                    : "غير محدد"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">مدة المجموعة:</span>
                <span className="font-bold text-foreground">{group.monthsCount} شهور</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Card 2: Teacher Contact Info */}
      {!isTeacher && group.teacher && (
        <Card className="p-6 border border-border bg-card shadow-none space-y-4 rounded-xl">
          <h3 className="font-bold text-foreground text-sm border-b border-border pb-3 flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>المعلم المسؤول</span>
          </h3>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-secondary text-primary border border-border flex items-center justify-center font-bold text-sm">
              {group.teacher.user.fullName.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-foreground text-sm truncate">
                {group.teacher.user.fullName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {group.teacher.specialization || "معلم المادة"}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-muted-foreground/70" />
              <span>{group.teacher.user.phone}</span>
            </div>
            {group.teacher.user.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="size-3.5 text-muted-foreground/70" />
                <span className="truncate">{group.teacher.user.email}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Card 3: Schedules */}
      <Card className="p-6 border border-border bg-card shadow-none space-y-4 rounded-xl">
        <h3 className="font-bold text-foreground text-sm border-b border-border pb-3 flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span>مواعيد الحصص الأسبوعية</span>
        </h3>

        {group.schedule && group.schedule.length > 0 ? (
          <div className="space-y-2">
            {group.schedule.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border text-xs"
              >
                <span className="font-bold text-foreground">
                  {DAY_NAMES_AR[item.day]}
                </span>
                <span className="font-bold text-primary bg-card px-2 py-0.5 rounded border border-border">
                  {formatTime(item.hour, item.minute)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic text-center py-2">
            لا توجد مواعيد محددة لهذه المجموعة.
          </p>
        )}
      </Card>
    </div>
  );
}
