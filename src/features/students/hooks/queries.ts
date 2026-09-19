import { useQuery } from "@tanstack/react-query";
import { getStudents, getStudentPaymentsAction } from "../actions/students-actions";
import { studentsKeys } from "../utils/queryKeys";
import { type Student } from "../types";
import { QueryParams, type ApiResponse } from "@/types";

export function useStudentsQuery(
  params: QueryParams & { gradeId?: string },
  initialData: ApiResponse<Student[]>,
) {
  // Only use initialData when params match initial state (page 1, limit 10, no search, no active filter, no gradeId filter)
  const isInitialParams =
    params.page === 1 &&
    params.limit === 10 &&
    !params.search &&
    (params.active === null || params.active === undefined || (params.active as unknown) === "") &&
    !params.gradeId;

  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: async () => {
      return getStudents(params);
    },
    initialData: isInitialParams ? initialData : undefined,
  });
}

export function useStudentPaymentsQuery(studentId: string, enabled = true) {
  return useQuery({
    queryKey: studentsKeys.payments(studentId),
    queryFn: async () => {
      return getStudentPaymentsAction(studentId);
    },
    enabled: !!studentId && enabled,
  });
}
