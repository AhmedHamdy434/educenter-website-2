import { QueryParams } from "@/types";
import { TeacherFilters } from "../types";

export const teachersKeys = {
  all: ["teachers"] as const,
  list: (params: QueryParams & TeacherFilters) =>
    ["teachers", params] as const,
  options: (subjectId?: string) =>
    ["teachers", "options", subjectId] as const,
};

