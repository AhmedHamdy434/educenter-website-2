import { useQuery } from "@tanstack/react-query";
import {
  getGroups,
  getGroup,
  getGroupPaymentsAction,
  getAvailableStudentsForGroup,
  getGroupStudents,
} from "../actions/groups-actions";
import { groupsKeys } from "../utils/queryKeys";
import {
  type GroupQueryParams,
  type GroupStudentsQueryParams,
  type GroupPaymentsQueryParams,
  type Group,
} from "../types";
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

export function useAvailableStudentsForGroup(
  groupId: string,
  params: GroupQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: groupsKeys.availableStudents(groupId, params),
    queryFn: async () => {
      return getAvailableStudentsForGroup(groupId, params);
    },
    enabled: !!groupId && enabled,
  });
}

export function useGroupStudentsQuery(
  groupId: string,
  params?: GroupStudentsQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: groupsKeys.students(groupId, params),
    queryFn: async () => {
      return getGroupStudents(groupId, params);
    },
    enabled: !!groupId && enabled,
  });
}

export function useGroupPaymentsQuery(
  groupId: string,
  params?: GroupPaymentsQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: groupsKeys.payments(groupId, params),
    queryFn: async () => {
      return getGroupPaymentsAction(groupId, params);
    },
    enabled: !!groupId && enabled,
  });
}
