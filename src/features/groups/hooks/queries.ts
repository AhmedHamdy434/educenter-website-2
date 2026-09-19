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


export function useGroupsQuery(
  params: GroupQueryParams,
  initialData: ApiResponse<Group[]>,
) {
  const isInitialParams =
    params.page === 1 &&
    params.limit === 10 &&
    !params.search &&
    (params.active === null ||
      params.active === undefined ||
      (params.active as unknown) === "") &&
    !params.gradeId &&
    !params.subjectId &&
    !params.teacherId;

  return useQuery({
    queryKey: groupsKeys.list(params),
    queryFn: async () => {
      return getGroups(params);
    },
    initialData: isInitialParams ? initialData : undefined,
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

