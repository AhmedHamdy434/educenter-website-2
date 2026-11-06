export interface CenterSettings {
  centerSharePercentage: number;
  teacherSharePercentage: number;
  allowStudentCreditAdvance: boolean;
  currency: string;
  receiptNotes?: string | null;
  updatedAt?: string;
}

export type UpdateCenterSettingsDTO = Partial<CenterSettings>;
