import { QueryParams } from "@/types";

export const studentsKeys = {
  all: ["students"] as const,
  list: (params: QueryParams & { gradeId?: string }) =>
    ["students", params] as const,
  payments: (studentId: string) => ["students", "payments", studentId] as const,
};
