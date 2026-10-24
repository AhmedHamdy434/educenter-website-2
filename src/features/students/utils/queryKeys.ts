import { StudentParams } from "../types";

export const studentsKeys = {
  all: ["students"] as const,
  list: (params: StudentParams) => [...studentsKeys.all, params] as const,
  options: (params: StudentParams) =>
    [...studentsKeys.all, "options", params] as const,
  payments: (studentId: string) =>
    [...studentsKeys.all, "payments", studentId] as const,
};
