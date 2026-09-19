import { QueryParams } from "@/types";

export const subjectsKeys = {
  all: ["subjects"] as const,
  list: (params: QueryParams & { gradeId?: string }) =>
    ["subjects", params] as const,
  options: (gradeId?: string) =>
    ["subjects", "options", gradeId] as const,
};
