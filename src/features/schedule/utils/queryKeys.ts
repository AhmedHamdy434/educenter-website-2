import {
  CalendarScheduleQueryParams,
  UpcomingScheduleQueryParams,
} from '../types';

export const scheduleKeys = {
  all: ['schedule'] as const,
  calendar: (params: CalendarScheduleQueryParams) =>
    [...scheduleKeys.all, 'calendar', params] as const,
  upcoming: (params: UpcomingScheduleQueryParams) =>
    [...scheduleKeys.all, 'upcoming', params] as const,
};

