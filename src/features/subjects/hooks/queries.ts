import { useQuery } from "@tanstack/react-query";
import { getSubjects, getSubjectsOptions } from "../actions/subjects-actions";
import { subjectsKeys } from "../utils/queryKeys";
import { type Subject } from "../types";
import { QueryParams, type ApiResponse } from "@/types";

export function useSubjectsQuery(
  params: QueryParams & { gradeId?: string },
  initialData: ApiResponse<Subject[]>,
) {
  // Only use initialData when params match initial state (page 1, limit 10, no search, no active filter, no gradeId filter)
  const isInitialParams =
    params.page === 1 &&
    params.limit === 10 &&
    !params.search &&
    (params.active === null || params.active === undefined || (params.active as unknown) === "") &&
    !params.gradeId;

  return useQuery({
    queryKey: subjectsKeys.list(params),
    queryFn: async () => {
      return getSubjects(params);
    },
    initialData: isInitialParams ? initialData : undefined,
  });
}

export function useSubjectsOptionsQuery(gradeId?: string, enabled = true) {
  return useQuery({
    queryKey: subjectsKeys.options(gradeId),
    queryFn: async () => {
      const res = await getSubjectsOptions(gradeId);
      if (!res.success) throw new Error(res.message);
      return (res.data || []).map((s) => ({
        value: s.id,
        label: `${s.name} (${s.grade.name})`,
      }));
    },
    enabled: enabled && !!gradeId,
  });
}
