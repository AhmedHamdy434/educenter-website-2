"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeacherGroupsQuery } from "@/features/groups/hooks/queries";
import { CalendarCheck, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/common/TableSearch";
import { Loading } from "@/components/common/Loading";
import { type Group } from "@/features/groups/types";
import { type ApiResponse } from "@/types";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface TeacherAttendanceListProps {
  initialData: ApiResponse<Group[]>;
}

export function TeacherAttendanceList({
  initialData,
}: TeacherAttendanceListProps) {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;
  const [search, setSearch] = useState("");

  // Load teacher's groups
  const { data: response, isLoading } = useTeacherGroupsQuery(
    { limit: 100 },
    initialData
  );

  const groupsData = response?.data;

  // Filter groups locally
  const filteredGroups = useMemo(() => {
    const list = groupsData || [];
    return list.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.subject.name.toLowerCase().includes(search.toLowerCase()) ||
        g.grade.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupsData, search]);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header with Focused Title Icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarCheck className="size-5.5 stroke-[2.25]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              التحضير والغياب
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              اختر المجموعة الدراسية لتسجيل حضور وغياب الطلاب لحصة اليوم.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80">
          <TableSearch
            placeholder="ابحث باسم المجموعة أو المادة..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* Grid of Groups with Varied Card Shape (Top Primary Accent) */}
      {isLoading ? (
        <Loading message="جاري تحميل المجموعات..." />
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="flex flex-col h-full border border-border border-t-3 border-t-primary bg-card shadow-none hover:border-primary/50 transition-all duration-200 p-5 space-y-4 rounded-xl"
            >
              {/* Info */}
              <div className="space-y-1 overflow-hidden border-b border-border pb-3">
                <h3 className="font-bold text-foreground text-base truncate" title={group.name}>
                  {group.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                  <GraduationCap className="size-3.5 text-muted-foreground" />
                  {group.grade.name}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2.5 text-xs text-muted-foreground flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المادة الدراسية</span>
                  <span className="font-bold text-foreground">{group.subject.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الطلاب المقيدون</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Users className="size-3.5 text-muted-foreground" />
                    {group._count?.students || 0} طالب
                  </span>
                </div>

                {/* Schedules */}
                <div className="border-t border-border pt-2.5 space-y-1">
                  <span className="text-muted-foreground block mb-1 text-[11px] font-semibold">المواعيد:</span>
                  {group.schedule && group.schedule.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.schedule.map((slot, i) => (
                        <span
                          key={slot.id || i}
                          className="bg-secondary/80 px-2 py-0.5 rounded-md text-[11px] font-semibold text-primary"
                        >
                          {DAY_NAMES_AR[slot.day]}: {formatTime(slot.hour, slot.minute)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">لا توجد مواعيد محددة</span>
                  )}
                </div>
              </div>

              {/* Redirect Action */}
              <div className="pt-2 border-t border-border">
                <Button
                  asChild
                  variant="brand"
                  className="w-full rounded-lg flex items-center justify-center gap-2 h-9 text-xs font-bold shadow-none"
                >
                  <Link href={`/${centerSlug}/teacher/attendance/${group.id}`}>
                    <span>فتح كشف الحضور والغياب</span>
                    <ArrowLeft className="size-3.5 rotate-180" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-card shadow-none max-w-lg mx-auto p-8">
          <CalendarCheck className="size-14 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">لا توجد مجموعات دراسية</h3>
          <p className="text-xs text-muted-foreground">
            لم يتم العثور على أي مجموعات دراسية مطابقة لبحثك.
          </p>
        </div>
      )}
    </div>
  );
}
