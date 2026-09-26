export interface Grade {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  centerId?: string;
  _count?: {
    subjects: number;
    groups: number;
    enrollments: number;
  };
}

export interface CreateGradeDTO {
  name: string;
  description?: string;
  order?: number;
}

export interface UpdateGradeDTO {
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface GradeFilters {
  active?: string;
}