export enum AssessmentStep {
  Welcome,
  CompanyOverview,
  OperationalMapping,
  TechnicalReadiness,
  ROIAnalysis,
  UseCasePrioritization,
  TeamReadiness,
  Report,
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
}