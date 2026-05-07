export interface SurveyInput {
  fullName: string;
  email: string;
  language: "en" | "ko";
  university: string;
  major: string;
  graduationDate: string;
  currentVisa: "D-2" | "D-10" | "E-7" | "Other";
  koreanLevel: "None" | "Basic" | "Intermediate" | "Advanced" | "Fluent";
  englishLevel: "Basic" | "Intermediate" | "Advanced" | "Fluent";
  targetJobFunction: string;
  targetIndustry: string;
  resumeStatus: "None" | "Draft" | "Completed" | "Submitted";
  koreaAppExperience: "Never" | "1-2 times" | "3+ times";
  biggestConcern: string;
}

export interface SurveyResult {
  readinessScore: number;
  jobReadiness: "Low" | "Medium" | "High";
  visaFit: "Needs Review" | "Partially Ready" | "Ready";
  mainConcern: string;
  recommendedRoles: string[];
  nextSteps: string[];
}

export interface SurveyResponse {
  success: boolean;
  data: SurveyInput & {
    result: SurveyResult;
    _id: string;
    submittedAt: string;
  };
}
