import { ExtraSessionsQueryParams } from '../types';

export const extraSessionsKeys = {
  all: ['extra-sessions'] as const,
  lists: () => [...extraSessionsKeys.all, 'list'] as const,
  list: (groupId: string, params?: ExtraSessionsQueryParams) =>
    [...extraSessionsKeys.lists(), groupId, params ?? {}] as const,
  details: () => [...extraSessionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...extraSessionsKeys.details(), id] as const,
};

