import Survey from "../models/Survey";
import { estimateSurvey } from "./estimationService";
import type { ISurvey } from "../models/Survey";

type SurveyInput = Omit<ISurvey, keyof Document | "result" | "submittedAt">;

export async function submitSurvey(data: SurveyInput) {
  const result = estimateSurvey(data);
  const survey = await Survey.create({ ...data, result });
  return survey;
}
