import { QueryParams } from "@/types";

export const gradesKeys = {
  all: ["grades"] as const,
  list: (params: QueryParams) =>
    ["grades", params] as const,
};
