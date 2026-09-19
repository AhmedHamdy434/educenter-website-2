export interface TeacherSubjectRelation {
  id: string;
  subject: {
    id: string;
    name: string;
    gradeId?: string;
  };
}

export interface Teacher {
  id: string;
  specialization: string;
  salary: number;
  bio?: string;
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
  subjects: TeacherSubjectRelation[];
}

export interface CreateTeacherDTO {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  avatar?: string;
  specialization: string;
  salary: number;
  bio?: string;
  subjectIds: string[];
}

export interface UpdateTeacherDTO {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  specialization?: string;
  salary?: number;
  bio?: string;
  subjectIds?: string[];
  isActive?: boolean;
}
