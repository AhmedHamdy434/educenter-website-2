import { useQuery } from '@tanstack/react-query';
import {
  getGroupExtraSessions,
  getExtraSessionDetails,
} from '../actions/extra-sessions-actions';
import { extraSessionsKeys } from '../utils/queryKeys';
import { ExtraSessionsQueryParams } from '../types';

export function useGroupExtraSessionsQuery(
  groupId: string,
  params?: ExtraSessionsQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: extraSessionsKeys.list(groupId, params),
    queryFn: () => getGroupExtraSessions(groupId, params),
    enabled: !!groupId && enabled,
  });
}

export function useExtraSessionDetailsQuery(id?: string, enabled = true) {
  return useQuery({
    queryKey: id ? extraSessionsKeys.detail(id) : extraSessionsKeys.details(),
    queryFn: () => getExtraSessionDetails(id!),
    enabled: !!id && enabled,
  });
}

