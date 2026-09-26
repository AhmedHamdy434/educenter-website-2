import { QueryParams } from "@/types";

export const gradesKeys = {
  all: ["grades"] as const,
  list: (params: QueryParams) => [...gradesKeys.all, params] as const,
  options: () => [...gradesKeys.all, "options"] as const,
};
