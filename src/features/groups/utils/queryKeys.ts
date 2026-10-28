import {
  GroupQueryParams,
  GroupStudentsQueryParams,
  GroupPaymentsQueryParams,
} from "../types";

export const groupsKeys = {
  all: ["groups"] as const,
  list: (params: GroupQueryParams) => ["groups", params] as const,
  detail: (id: string) => ["groups", "detail", id] as const,
  teacherList: (params: GroupQueryParams) =>
    ["groups", "teacher", params] as const,
  availableStudents: (groupId: string, params: GroupQueryParams) =>
    ["groups", "available-students", groupId, params] as const,
  students: (
    groupId: string,
    params?: GroupStudentsQueryParams | GroupQueryParams,
  ) => ["groups", "students", groupId, params] as const,
  payments: (groupId: string, params?: GroupPaymentsQueryParams) =>
    ["groups", "payments", groupId, params] as const,
};
