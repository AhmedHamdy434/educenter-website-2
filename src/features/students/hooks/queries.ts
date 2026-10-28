import { useQuery } from "@tanstack/react-query";
import {
  getStudents,
  getStudentPaymentsAction,
} from "../actions/students-actions";
import { studentsKeys } from "../utils/queryKeys";
import { StudentParams } from "../types";

export function useStudentsQuery(params: StudentParams) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: async () => {
      return getStudents(params);
    },
  });
}

export function useStudentPaymentsQuery(
  studentId: string,
  groupId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: studentsKeys.payments(studentId, groupId),
    queryFn: async () => {
      return getStudentPaymentsAction(studentId, groupId);
    },
    enabled: !!studentId && enabled,
  });
}
