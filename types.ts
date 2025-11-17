
export enum AssessmentStep {
  Welcome,
  CompanyProfile,
  Operations,
  DataReadiness,
  AutomationPotential,
  Results,
  Report,
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
}
