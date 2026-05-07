import mongoose, { Document, Schema } from "mongoose";

export interface ISurveyResult {
  readinessScore: number;
  jobReadiness: "Low" | "Medium" | "High";
  visaFit: "Needs Review" | "Partially Ready" | "Ready";
  mainConcern: string;
  recommendedRoles: string[];
  nextSteps: string[];
}

export interface ISurvey extends Document {
  // Contact
  fullName: string;
  email: string;
  language: "en" | "ko";

  // Academic
  university: string;
  major: string;
  graduationDate: string;

  // Visa
  currentVisa: "D-2" | "D-10" | "E-7" | "Other";

  // Language
  koreanLevel: "None" | "Basic" | "Intermediate" | "Advanced" | "Fluent";
  englishLevel: "Basic" | "Intermediate" | "Advanced" | "Fluent";

  // Career
  targetJobFunction: string;
  targetIndustry: string;

  // Readiness
  resumeStatus: "None" | "Draft" | "Completed" | "Submitted";
  koreaAppExperience: "Never" | "1-2 times" | "3+ times";
  biggestConcern: string;

  // Generated result
  result: ISurveyResult;

  submittedAt: Date;
}

const SurveyResultSchema = new Schema<ISurveyResult>(
  {
    readinessScore: { type: Number, required: true },
    jobReadiness: { type: String, enum: ["Low", "Medium", "High"], required: true },
    visaFit: { type: String, enum: ["Needs Review", "Partially Ready", "Ready"], required: true },
    mainConcern: { type: String, required: true },
    recommendedRoles: { type: [String], required: true },
    nextSteps: { type: [String], required: true },
  },
  { _id: false }
);

const SurveySchema = new Schema<ISurvey>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    language: { type: String, enum: ["en", "ko"], default: "en" },

    university: { type: String, required: true, trim: true },
    major: { type: String, required: true, trim: true },
    graduationDate: { type: String, required: true },

    currentVisa: { type: String, enum: ["D-2", "D-10", "E-7", "Other"], required: true },

    koreanLevel: {
      type: String,
      enum: ["None", "Basic", "Intermediate", "Advanced", "Fluent"],
      required: true,
    },
    englishLevel: {
      type: String,
      enum: ["Basic", "Intermediate", "Advanced", "Fluent"],
      required: true,
    },

    targetJobFunction: { type: String, required: true, trim: true },
    targetIndustry: { type: String, required: true, trim: true },

    resumeStatus: {
      type: String,
      enum: ["None", "Draft", "Completed", "Submitted"],
      required: true,
    },
    koreaAppExperience: {
      type: String,
      enum: ["Never", "1-2 times", "3+ times"],
      required: true,
    },
    biggestConcern: { type: String, required: true, trim: true },

    result: { type: SurveyResultSchema, required: true },

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISurvey>("Survey", SurveySchema);
