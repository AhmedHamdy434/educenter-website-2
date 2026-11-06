import { QueryParams } from "@/types";

export interface StudentEnrollment {
  id: string;
  isActive: boolean;
  enrollmentDate?: string;
  gradeId?: string;
  grade: {
    id: string;
    name: string;
  };
}

export interface Student {
  id: string;
  code?: string;
  parentPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    isActive: boolean;
    centerId?: string;
  };
  enrollments: StudentEnrollment[];
}

export interface CreateStudentDTO {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  avatar?: string;
  parentPhone: string;
  notes?: string;
  gradeId: string;
  code?: string;
}

export interface UpdateStudentDTO {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  parentPhone?: string;
  notes?: string;
  gradeId?: string;
  code?: string;
  isActive?: boolean;
}

 export interface StudentPaymentMonthItem {
  month: string;
  amountDue: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  isWaived: boolean;
}

 export interface StudentPaymentHistoryItem {
  id: string;
  receiptNumber: string;
  groupId: string;
  groupName: string;
  subscriptionDate: string;
  amount: number;
  refundedAmount: number;
  amountDue: number;
  remainingAfter: number;
  status: 'PAID' | 'PARTIALLY_PAID';
  paymentMethod: string;
  paidAt: string;
  notes: string | null;
  isLegacy: boolean;
}

 export interface StudentPaymentsTotals {
  paymentsCount: number;
  totalPaid: number;
  totalRefunded: number;
  totalRemaining: number;
}

export interface StudentPayment {
  group: {
    id: string;
    name: string;
    monthlyFee: number;
    startDate: string;
    monthsCount: number;
  } | null;
  groupStudentId: string | null;
  subscriptionStartDate: string | null;
  canRecordPayment: boolean;
  months: StudentPaymentMonthItem[];
  defaultMonth: string | null;
  payments: StudentPaymentHistoryItem[];
  totals: StudentPaymentsTotals;
}

export interface StudentFilters {
  active?: string;
  gradeId?: string;
}

export interface StudentParams extends QueryParams {
  gradeId?: string;
}
