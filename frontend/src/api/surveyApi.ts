import axios from "axios";
import type { SurveyInput, SurveyResponse } from "../types/survey";

const API_URL = "http://localhost:5000/api/survey";

export async function submitSurvey(data: SurveyInput): Promise<SurveyResponse> {
  const response = await axios.post<SurveyResponse>(API_URL, data);
  return response.data;
}
