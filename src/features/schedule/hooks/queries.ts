import { useQuery } from "@tanstack/react-query";
import {
  getCalendarScheduleAction,
  getUpcomingScheduleAction,
} from "../actions/schedule-actions";
import { scheduleKeys } from "../utils/queryKeys";
import {
  CalendarScheduleQueryParams,
  UpcomingScheduleQueryParams,
} from "../types";

export function useCalendarScheduleQuery(
  params: CalendarScheduleQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: scheduleKeys.calendar(params),
    queryFn: async () => getCalendarScheduleAction(params),
    enabled,
  });
}

export function useUpcomingScheduleQuery(
  params: UpcomingScheduleQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: scheduleKeys.upcoming(params),
    queryFn: async () => getUpcomingScheduleAction(params),
    enabled,
  });
}
