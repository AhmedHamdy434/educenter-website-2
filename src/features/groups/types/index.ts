import { QueryParams } from "@/types";
import { type DayOfWeek } from "@/utils/time";
export type { DayOfWeek };

export interface GroupScheduleItem {
  id?: string;
  day: DayOfWeek;
  hour: number;
  minute: number;
}

export interface Group {
  id: string;
  name: string;
  capacity: number | null;
  isActive: boolean;
  centerId: string;
  gradeId: string;
  grade: {
    id: string;
    name: string;
  };
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  teacherId: string;
  teacher: {
    id: string;
    user: {
      fullName: string;
      avatar: string | null;
    };
  };
  schedule: GroupScheduleItem[];
  monthlyFee: number;
  startDate: string;
  monthsCount: number;
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroupEnrolledStudent {
  id: string;
  studentId?: string;
  joinedAt: string;
  subscriptionStartDate?: string;
  student: {
    id: string;
    code?: string;
    parentPhone: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      avatar: string | null;
    };
  };
}

export type GroupStudent = GroupEnrolledStudent;

export interface AvailableGroupStudent {
  id: string;
  parentPhone?: string;
  user: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    avatar?: string | null;
  };
}

export interface GroupDetails extends Group {
  teacher: {
    id: string;
    specialization?: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      avatar: string | null;
    };
  };
  students: GroupStudent[];
}

export interface CreateGroupDTO {
  name: string;
  gradeId: string;
  subjectId: string;
  teacherId: string;
  capacity?: number;
  schedule: {
    day: DayOfWeek;
    hour: number;
    minute: number;
  }[];
  monthlyFee: number;
  startDate: string;
  monthsCount: number;
}

export interface UpdateGroupDTO {
  name?: string;
  gradeId?: string;
  subjectId?: string;
  teacherId?: string;
  capacity?: number;
  schedule?: {
    day: DayOfWeek;
    hour: number;
    minute: number;
  }[];
  monthlyFee?: number;
  startDate?: string;
  monthsCount?: number;
  isActive?: boolean;
}

export interface GroupStudentPaymentDetail {
  id: string;
  subscriptionDate: string;
  amount: number;
  paidAt: string;
  notes: string | null;
}

export interface GroupPaymentsStats {
  /** إجمالي الطلاب المسجلين في المجموعة */
  total: number;
  /** عدد المسددين للشهر المستهدف (أو كل الأشهر) */
  paid: number;
  /** عدد غير المسددين */
  unpaid: number;
  /** الإيراد المتوقع (ج.م) */
  expected: number;
  /** الإيراد المحصَّل (ج.م) */
  collected: number;
  /** قائمة شهور المجموعة بصيغة YYYY-MM-DD */
  groupMonths: string[];
}

export interface GroupStudentPaymentInfo {
  groupStudentId: string;
  studentId: string;
  studentInfo: {
    fullName: string;
    code?: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
  subscriptionStartDate: string;
  monthlyFee: number;
  requiredMonths: string[];
  paidMonths: GroupStudentPaymentDetail[];
  unpaidMonths: string[];
}

export interface GroupPaymentsQueryParams extends QueryParams {
  month?: string;
  sortBy?: "name" | "joinedAt" | "subscriptionStartDate" | string;
  sortOrder?: "asc" | "desc";
}
export interface GroupStudentsQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GroupFilters {
  active?: string;
  gradeId?: string;
  subjectId?: string;
  teacherId?: string;
}

export interface GroupQueryParams extends QueryParams {
  active?: string | boolean;
  gradeId?: string;
  subjectId?: string;
  teacherId?: string;
}
