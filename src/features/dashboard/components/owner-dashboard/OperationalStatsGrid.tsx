"use client";

import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import { Users, GraduationCap, Layers, BookOpen } from "lucide-react";
import { OperationalStats } from "../../types";

interface OperationalStatsGridProps {
  stats?: OperationalStats;
  isLoading?: boolean;
}

export function OperationalStatsGrid({
  stats,
  isLoading = false,
}: OperationalStatsGridProps) {
  const cards = [
    {
      label: "إجمالي الطلاب",
      value: stats?.totalStudents,
      icon: Users,
      unit: `(${stats?.activeStudents} نشط)`,
    },
    {
      label: "المعلمون المسجلون",
      value: stats?.totalTeachers,
      icon: GraduationCap,
      unit: "معلم",
    },
    {
      label: "المجموعات الدراسية",
      value: stats?.totalGroups,
      icon: Layers,
      unit: `(${stats?.activeGroups} نشطة)`,
    },
    {
      label: "المواد والمراحل",
      value: stats?.totalSubjects,
      icon: BookOpen,
      unit: `في ${stats?.totalGrades} مراحل`,
    },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon, unit }) =>
        isLoading ? (
          <StatCardSkeleton key={label} />
        ) : (
          <StatCard
            key={label}
            label={label}
            value={value}
            icon={icon}
            unit={unit}
          />
        ),
      )}
    </div>
  );
}
