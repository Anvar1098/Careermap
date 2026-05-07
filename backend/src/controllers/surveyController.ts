import type { Request, Response } from "express";
import { submitSurvey as submitSurveyService } from "../services/surveyService";

export async function submitSurvey(req: Request, res: Response): Promise<void> {
  try {
const survey = await submitSurveyService(req.body);
    res.status(201).json({ success: true, data: survey });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit survey", error });
  }
}
