export interface Grade {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
