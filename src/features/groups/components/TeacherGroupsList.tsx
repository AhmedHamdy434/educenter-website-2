"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeacherGroupsQuery } from "../hooks/queries";
import { BookOpen, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/common/TableSearch";
import { Loading } from "@/components/common/Loading";
import { type Group } from "../types";
import { type ApiResponse } from "@/types";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface TeacherGroupsListProps {
  initialData: ApiResponse<Group[]>;
}

export function TeacherGroupsList({ initialData }: TeacherGroupsListProps) {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;
  const [search, setSearch] = useState("");

  // Load teacher's groups with custom query hook
  const { data: response, isLoading } = useTeacherGroupsQuery(
    { limit: 100 },
    initialData,
  );

  const groupsData = response?.data;

  // Filter groups locally by search query
  const filteredGroups = useMemo(() => {
    const list = groupsData || [];
    return list.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.subject.name.toLowerCase().includes(search.toLowerCase()) ||
        g.grade.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [groupsData, search]);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <BookOpen className="size-6 text-primary" />
            مجموعاتي الدراسية
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            عرض المجموعات الدراسية المسؤولة عنها ومتابعة حضور وغياب الطلاب.
          </p>
        </div>

        <div className="w-full md:w-80">
          <TableSearch
            placeholder="ابحث باسم المجموعة، المادة، أو المرحلة..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* Grid of groups */}
      {isLoading ? (
        <Loading message="جاري تحميل المجموعات..." />
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="flex flex-col h-full border border-border bg-card shadow-none hover:border-primary/40 transition-all duration-200 p-6 space-y-4 rounded-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 overflow-hidden">
                  <h3
                    className="font-bold text-foreground text-base truncate"
                    title={group.name}
                  >
                    {group.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                    <GraduationCap className="size-3.5" />
                    {group.grade.name}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2.5 text-xs text-muted-foreground flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المادة</span>
                  <span className="font-bold text-foreground">
                    {group.subject.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الطلاب المقيدون</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Users className="size-3.5 text-muted-foreground" />
                    {group._count?.students || 0} / {group.capacity || "∞"}
                  </span>
                </div>

                {/* Schedules */}
                <div className="border-t border-border pt-2.5 flex flex-wrap">
                  <span className="text-muted-foreground block mb-1 text-[11px] font-semibold">
                    مواعيد الحصة الأسبوعية:
                  </span>
                  {group.schedule && group.schedule.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.schedule.map((slot, i) => (
                        <span
                          key={slot.id || i}
                          className="bg-secondary border border-border px-2 py-0.5 rounded-md text-[11px] font-semibold text-primary"
                        >
                          {DAY_NAMES_AR[slot.day]}:{" "}
                          {formatTime(slot.hour, slot.minute)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">
                      لا توجد مواعيد محددة
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-border">
                <Button
                  asChild
                  variant="brandOutline"
                  className="w-full rounded-lg flex items-center justify-center gap-2 h-9 text-xs font-semibold"
                >
                  <Link href={`/${centerSlug}/teacher/groups/${group.id}`}>
                    <span>عرض التفاصيل</span>
                    <ArrowLeft className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-2xl bg-card shadow-none max-w-lg mx-auto p-8">
          <BookOpen className="size-14 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-foreground text-lg">
            لم يتم العثور على مجموعات
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? "لم يتم العثور على أي مجموعة تطابق بحثك الحالي."
              : "لم يتم تعيينك كمعلم مسؤول لأي مجموعة دراسية نشطة حالياً."}
          </p>
        </div>
      )}
    </div>
  );
}
