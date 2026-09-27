import { useQuery } from "@tanstack/react-query";
import {
  getGroups,
  getGroup,
  getGroupPaymentsAction,
  type GroupQueryParams,
} from "../actions/groups-actions";
import { groupsKeys } from "../utils/queryKeys";
import { type Group } from "../types";
import { type ApiResponse } from "@/types";


export function useGroupsQuery(params: GroupQueryParams) {
  return useQuery({
    queryKey: groupsKeys.list(params),
    queryFn: async () => {
      return getGroups(params);
    },
  });
}

export function useGroupQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: groupsKeys.detail(id),
    queryFn: async () => {
      return getGroup(id);
    },
    enabled: !!id && enabled,
  });
}

export function useTeacherGroupsQuery(
  params: GroupQueryParams,
  initialData?: ApiResponse<Group[]>,
) {
  return useQuery({
    queryKey: groupsKeys.teacherList(params),
    queryFn: async () => {
      return getGroups(params);
    },
    initialData,
  });
}

export function useGroupPaymentsQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: groupsKeys.payments(groupId),
    queryFn: async () => {
      return getGroupPaymentsAction(groupId);
    },
    enabled: !!groupId && enabled,
  });
}

