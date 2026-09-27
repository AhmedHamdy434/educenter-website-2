import { useQuery } from "@tanstack/react-query";
import { getSubjects, getSubjectsOptions } from "../actions/subjects-actions";
import { subjectsKeys } from "../utils/queryKeys";
import { QueryParams } from "@/types";

export function useSubjectsQuery(
  params: QueryParams & { gradeId?: string },
) {
  return useQuery({
    queryKey: subjectsKeys.list(params),
    queryFn: async () => {
      return getSubjects(params);
    },
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
    enabled: enabled && (gradeId === undefined || !!gradeId),
  });
}
