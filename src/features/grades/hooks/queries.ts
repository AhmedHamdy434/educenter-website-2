import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../actions/grades-actions";
import { gradesKeys } from "../utils/queryKeys";
import { QueryParams } from "@/types";
import { toSelectOptions } from "@/utils/options";

export function useGradesQuery(params: QueryParams) {
  return useQuery({
    queryKey: gradesKeys.list(params),
    queryFn: async () => getGrades(params),
  });
}

export function useGradesOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: gradesKeys.options(),
    queryFn: async () => {
      const res = await getGrades({ limit: 100 });
      return toSelectOptions(res.data);
    },
    enabled,
  });
}
