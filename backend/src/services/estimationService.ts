import type { ISurvey, ISurveyResult } from "../models/Survey";

type SurveyInput = Omit<ISurvey, keyof Document | "result" | "submittedAt">;

// --- Scoring functions ---

function scoreKoreanLevel(level: ISurvey["koreanLevel"]): number {
  const scores: Record<ISurvey["koreanLevel"], number> = {
    None: 0,
    Basic: 5,
    Intermediate: 12,
    Advanced: 20,
    Fluent: 25,
  };
  return scores[level];
}

function scoreEnglishLevel(level: ISurvey["englishLevel"]): number {
  const scores: Record<ISurvey["englishLevel"], number> = {
    Basic: 2,
    Intermediate: 5,
    Advanced: 8,
    Fluent: 10,
  };
  return scores[level];
}

function scoreResumeStatus(status: ISurvey["resumeStatus"]): number {
  const scores: Record<ISurvey["resumeStatus"], number> = {
    None: 0,
    Draft: 5,
    Completed: 15,
    Submitted: 20,
  };
  return scores[status];
}

function scoreKoreaAppExperience(experience: ISurvey["koreaAppExperience"]): number {
  const scores: Record<ISurvey["koreaAppExperience"], number> = {
    Never: 0,
    "1-2 times": 8,
    "3+ times": 15,
  };
  return scores[experience];
}

function scoreVisa(visa: ISurvey["currentVisa"]): number {
  const scores: Record<ISurvey["currentVisa"], number> = {
    Other: 5,
    "D-2": 10,
    "D-10": 15,
    "E-7": 20,
  };
  return scores[visa];
}

function scoreGraduationProximity(graduationDate: string): number {
  const monthsUntilGraduation =
    (new Date(graduationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsUntilGraduation <= 6) return 10;
  if (monthsUntilGraduation <= 12) return 6;
  return 2;
}

// --- Readiness level ---

function getJobReadiness(score: number): ISurveyResult["jobReadiness"] {
  if (score >= 71) return "High";
  if (score >= 41) return "Medium";
  return "Low";
}

// --- Visa fit ---

function getVisaFit(
  visa: ISurvey["currentVisa"],
  graduationDate: string
): ISurveyResult["visaFit"] {
  if (visa === "E-7") return "Ready";
  if (visa === "D-10") return "Partially Ready";

  if (visa === "D-2") {
    const monthsUntilGraduation =
      (new Date(graduationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilGraduation <= 6 ? "Partially Ready" : "Needs Review";
  }

  return "Needs Review";
}

// --- Recommended roles ---

function getRecommendedRoles(
  jobFunction: string,
  koreanLevel: ISurvey["koreanLevel"]
): string[] {
  const isHighKorean = ["Advanced", "Fluent"].includes(koreanLevel);

  const roleMap: Record<string, [string[], string[]]> = {
    Marketing: [
      ["Global Marketing", "Brand Strategy"],
      ["Korean Marketing", "Brand Management"],
    ],
    "IT/Engineering": [
      ["Software Engineer", "Data Analyst"],
      ["Full Stack Developer", "IT Consultant"],
    ],
    Finance: [
      ["Financial Analyst", "Accounting"],
      ["Corporate Finance", "Investment Analysis"],
    ],
    "Sales/BD": [
      ["Global Sales", "Export Manager"],
      ["Business Development", "Account Manager"],
    ],
    Design: [
      ["UI/UX Designer", "Visual Designer"],
      ["Product Designer", "Creative Director"],
    ],
    HR: [
      ["HR Coordinator", "Recruiter"],
      ["HR Manager", "Talent Acquisition"],
    ],
  };

  const roles = roleMap[jobFunction] ?? [
    ["Global Operations", "Coordinator"],
    ["Operations Manager", "Project Manager"],
  ];

  return isHighKorean ? roles[1] : roles[0];
}

// --- Next steps ---

function getNextSteps(data: SurveyInput): string[] {
  const steps: string[] = [];

  if (["None", "Basic"].includes(data.koreanLevel)) {
    steps.push("Improve Korean language skills (target TOPIK Level 3+)");
  }

  if (["None", "Draft"].includes(data.resumeStatus)) {
    steps.push("Complete and finalize your Korean-style resume (이력서)");
  }

  if (data.koreaAppExperience === "Never") {
    steps.push("Start applying to Korean companies via Saramin or Wanted");
  }

  if (data.currentVisa === "D-2") {
    steps.push("Prepare for D-10 job-seeker visa transition after graduation");
  }

  if (["Basic", "Intermediate"].includes(data.englishLevel)) {
    steps.push("Strengthen English proficiency for global-role applications");
  }

  const monthsUntilGraduation =
    (new Date(data.graduationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsUntilGraduation <= 6) {
    steps.push("Begin job applications immediately — graduation is approaching");
  }

  return steps;
}

// --- Main exported function ---

export function estimateSurvey(data: SurveyInput): ISurveyResult {
  const readinessScore =
    scoreKoreanLevel(data.koreanLevel) +
    scoreEnglishLevel(data.englishLevel) +
    scoreResumeStatus(data.resumeStatus) +
    scoreKoreaAppExperience(data.koreaAppExperience) +
    scoreVisa(data.currentVisa) +
    scoreGraduationProximity(data.graduationDate);

  return {
    readinessScore,
    jobReadiness: getJobReadiness(readinessScore),
    visaFit: getVisaFit(data.currentVisa, data.graduationDate),
    mainConcern: data.biggestConcern,
    recommendedRoles: getRecommendedRoles(data.targetJobFunction, data.koreanLevel),
    nextSteps: getNextSteps(data),
  };
}
