import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../actions/grades-actions";
import { gradesKeys } from "../utils/queryKeys";
import { type Grade } from "../types";
import { QueryParams, type ApiResponse } from "@/types";

export function useGradesQuery(
  params: QueryParams,
  initialData: ApiResponse<Grade[]>,
) {
  // Only use initialData when params match the initial state (page 1, limit 10, no search, no active filter)
  const isInitialParams =
    params.page === 1 &&
    params.limit === 10 &&
    !params.search &&
    (params.active === null || params.active === undefined || (params.active as unknown) === "");

  return useQuery({
    queryKey: gradesKeys.list(params),
    queryFn: async () => {
      return getGrades(params);
    },
    initialData: isInitialParams ? initialData : undefined,
  });
}
