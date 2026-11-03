"use client";

import { useState, useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import {
  ScheduleViewMode,
  ScheduleFilterState,
  ScheduleSessionItem,
} from "../types";
import { getCairoCurrentMonth, getNextMonth } from "../utils/date-helpers";
import {
  useCalendarScheduleQuery,
  useUpcomingScheduleQuery,
} from "../hooks/queries";
import { ScheduleHeader } from "./ScheduleHeader";
import { ScheduleFilters } from "./ScheduleFilters";
import { CalendarGrid } from "./calendar-view/CalendarGrid";
import { ScheduleAccordion } from "./accordion-view/ScheduleAccordion";
import {
  ScheduleCalendarSkeleton,
  ScheduleAccordionSkeleton,
} from "./ScheduleSkeletons";
import { PageHeader } from "@/components/common/PageHeader";
import { QueryErrorState } from "@/components/common/QueryErrorState";

export function ScheduleViewClient() {
  const initialFilter: ScheduleFilterState = {
    teacherId: undefined,
    gradeId: undefined,
    subjectId: undefined,
    groupId: undefined,
    status: "ALL",
    extraOnly: false,
  };
  // 1. Month state (defaults to Cairo current month or URL query param)
  const [month, setMonth] = useState<string>(getCairoCurrentMonth());

  // 2. View mode state (Calendar vs Accordion, persisted in localStorage)
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("calendar");

  const handleViewModeChange = (mode: ScheduleViewMode) => {
    setViewMode(mode);
  };

  // 3. Filter state
  const [filters, setFilters] = useState<ScheduleFilterState>(initialFilter);

  const handleFilterChange = (newFilters: Partial<ScheduleFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 4. Data fetching based on active view mode
  const calendarQueryParams = {
    month,
    teacherId: filters.teacherId,
    gradeId: filters.gradeId,
    subjectId: filters.subjectId,
    groupId: filters.groupId,
  };

  const upcomingQueryParams = {
    teacherId: filters.teacherId,
    gradeId: filters.gradeId,
    subjectId: filters.subjectId,
    groupId: filters.groupId,
  };

  const {
    data: calendarResponse,
    isLoading: isCalendarLoading,
    isError: isCalendarError,
    error: calendarError,
    refetch: refetchCalendar,
  } = useCalendarScheduleQuery(calendarQueryParams, viewMode === "calendar");

  const {
    data: upcomingResponse,
    isLoading: isUpcomingLoading,
    isError: isUpcomingError,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useUpcomingScheduleQuery(upcomingQueryParams, viewMode === "accordion");

  const rawSessions: ScheduleSessionItem[] = useMemo(() => {
    if (viewMode === "calendar") {
      return calendarResponse?.data?.sessions || [];
    }
    return upcomingResponse?.data?.sessions || [];
  }, [viewMode, calendarResponse, upcomingResponse]);

  // 5. Apply Client-side status and extraOnly filter
  const filteredSessions = useMemo(() => {
    let list = rawSessions;
    if (filters.status !== "ALL") {
      list = list.filter((s) => s.attendanceStatus === filters.status);
    }
    if (filters.extraOnly) {
      list = list.filter((s) => s.isExtraSession);
    }
    return list;
  }, [rawSessions, filters.status, filters.extraOnly]);

  const isLoading =
    viewMode === "calendar" ? isCalendarLoading : isUpcomingLoading;
  const isError = viewMode === "calendar" ? isCalendarError : isUpcomingError;
  const error = viewMode === "calendar" ? calendarError : upcomingError;
  const refetch = viewMode === "calendar" ? refetchCalendar : refetchUpcoming;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="جدول الحصص"
        description=" عرض ومتابعة جدول الحصص الأسبوعي والشهري وإدارة كشوف حضور وغياب الطلاب."
        icon={CalendarCheck}
      />

      {/* View Switcher & Month Navigation Controls */}
      <ScheduleHeader
        month={month}
        onMonthChange={setMonth}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Filters Toolbar */}
      <ScheduleFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={() => setFilters(initialFilter)}
      />

      {/* View Content (Loading, Error, Calendar or Accordion) */}
      {isLoading ? (
        viewMode === "calendar" ? (
          <ScheduleCalendarSkeleton />
        ) : (
          <ScheduleAccordionSkeleton />
        )
      ) : isError ? (
        <QueryErrorState
          title="تعذر تحميل جدول الحصص"
          error={error}
          onRetry={refetch}
        />
      ) : viewMode === "calendar" ? (
        <CalendarGrid month={month} sessions={filteredSessions} />
      ) : (
        <ScheduleAccordion
          sessions={filteredSessions}
          onGoToNextMonth={() => {
            setMonth(getNextMonth(month));
            setViewMode("calendar");
          }}
        />
      )}
    </div>
  );
}
