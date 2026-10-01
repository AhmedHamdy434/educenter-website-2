export interface TeacherSubjectRelation {
  id: string;
  subject: {
    id: string;
    name: string;
    gradeId?: string;
    grade?: {
      id: string;
      name: string;
    };
  };
}

export interface Teacher {
  id: string;
  bio?: string | null;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string | null;
    isActive: boolean;
    centerId?: string;
  };
  subjects: TeacherSubjectRelation[];
}

export interface CreateTeacherDTO {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  subjectIds: string[];
}

export interface UpdateTeacherDTO {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  subjectIds?: string[];
  isActive?: boolean;
}

export interface TeacherFilters {
  active?: string;
  gradeId?: string;
  subjectId?: string;
}

