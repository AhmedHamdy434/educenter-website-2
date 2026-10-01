import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "../actions/teachers-actions";
import { teachersKeys } from "../utils/queryKeys";
import { QueryParams } from "@/types";
import { type TeacherFilters } from "../types";

export function useTeachersQuery(
  params: QueryParams & TeacherFilters,
) {
  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: async () => {
      return getTeachers(params);
    },
  });
}


export function useTeachersOptionsQuery(subjectId?: string, enabled = true) {
  return useQuery({
    queryKey: teachersKeys.options(subjectId),
    queryFn: async () => {
      const res = await getTeachers({ subjectId, limit: 100 });
      if (!res.success) throw new Error(res.message);
      return (res.data || []).map((t) => ({
        value: t.id,
        label: t.user.fullName,
      }));
    },
    enabled: enabled && !!subjectId,
  });
}
