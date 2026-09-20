import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../actions/grades-actions";
import { gradesKeys } from "../utils/queryKeys";
import { type Grade } from "../types";
import { QueryParams, type ApiResponse } from "@/types";

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
