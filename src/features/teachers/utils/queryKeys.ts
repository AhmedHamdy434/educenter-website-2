import { QueryParams } from "@/types";

export const teachersKeys = {
  all: ["teachers"] as const,
  list: (params: QueryParams & { subjectId?: string }) =>
    ["teachers", params] as const,
  options: (subjectId?: string) =>
    ["teachers", "options", subjectId] as const,
};
