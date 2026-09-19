export interface StudentEnrollment {
  id: string;
  isActive: boolean;
  enrollmentDate?: string;
  grade: {
    id: string;
    name: string;
  };
}

export interface Student {
  id: string;
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
  isActive?: boolean;
}

export interface StudentPayment {
  id: string;
  subscriptionDate: string;
  amount: number;
  paidAt: string;
  notes: string | null;
  group: {
    id: string;
    name: string;
  };
}
