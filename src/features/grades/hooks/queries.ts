import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../actions/grades-actions";
import { gradesKeys } from "../utils/queryKeys";
import { type Grade } from "../types";
import { QueryParams, type ApiResponse } from "@/types";
import { toSelectOptions } from "@/utils/options";

export function useGradesQuery(
  params: QueryParams,
  initialData?: ApiResponse<Grade[]>,
) {
  return useQuery({
    queryKey: gradesKeys.list(params),
    queryFn: async () => getGrades(params),
    initialData: initialData ? initialData : undefined,
  });
}

export function useGradesOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: gradesKeys.options(),
    queryFn: async () => {
      const res = await getGrades({ limit: 100, active: "true" });
      return toSelectOptions(res.data);
    },
    enabled,
  });
}
