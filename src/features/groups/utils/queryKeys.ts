import { GroupQueryParams } from "../actions/groups-actions";

export const groupsKeys = {
  all: ["groups"] as const,
  list: (params: GroupQueryParams) => ["groups", params] as const,
  detail: (id: string) => ["groups", "detail", id] as const,
  teacherList: (params: GroupQueryParams) => ["groups", "teacher", params] as const,
  payments: (groupId: string) => ["groups", "payments", groupId] as const,
};
