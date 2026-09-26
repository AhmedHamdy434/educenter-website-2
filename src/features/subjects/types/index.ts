export interface Subject {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  gradeId: string;
  grade?: {
    id: string;
    name: string;
  };
  _count?: {
    groups?: number;
    teacherSubjects?: number;
  };
  createdAt: string;
}

export interface CreateSubjectDTO {
  name: string;
  description?: string;
  gradeId: string;
}

export interface UpdateSubjectDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface SubjectFilters {
  active?: string;
  gradeId?: string;
}
