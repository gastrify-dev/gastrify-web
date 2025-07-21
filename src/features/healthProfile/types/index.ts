import z from "zod/v4";

import { personalInfo } from "../schemas/personal-info";
import { medicalInfo } from "../schemas/medical-info";

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export type PersonalInfoVariables = z.infer<typeof personalInfo>;
export type MedicalInfoVariables = z.infer<typeof medicalInfo>;
