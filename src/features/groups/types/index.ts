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

export interface GroupStudent {
  id: string;
  joinedAt: string;
  subscriptionStartDate?: string;
  student: {
    id: string;
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

export interface GroupDetails extends Group {
  teacher: {
    id: string;
    specialization: string;
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

export interface GroupStudentPaymentInfo {
  groupStudentId: string;
  studentId: string;
  studentInfo: {
    fullName: string;
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

