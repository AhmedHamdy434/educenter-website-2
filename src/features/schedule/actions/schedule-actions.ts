'use server';

import { serverApiClient } from '@/lib/api/apiClient';
import { ApiResponse } from '@/types';
import {
  CalendarScheduleData,
  CalendarScheduleQueryParams,
  UpcomingScheduleData,
  UpcomingScheduleQueryParams,
} from '../types';

export async function getCalendarScheduleAction(
  params: CalendarScheduleQueryParams,
): Promise<ApiResponse<CalendarScheduleData>> {
  return serverApiClient<CalendarScheduleData>({
    url: '/schedule/calendar',
    method: 'GET',
    params,
    cache: 'no-store',
  });
}

export async function getUpcomingScheduleAction(
  params: UpcomingScheduleQueryParams,
): Promise<ApiResponse<UpcomingScheduleData>> {
  return serverApiClient<UpcomingScheduleData>({
    url: '/schedule/upcoming',
    method: 'GET',
    params,
    cache: 'no-store',
  });
}

