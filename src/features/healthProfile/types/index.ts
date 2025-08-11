import { z } from "zod/v4";

import { personalInfo } from "@/features/healthProfile/schemas/personal-info";
import { medicalInfo } from "@/features/healthProfile/schemas/medical-info";
import { emergencyContacts } from "@/features/healthProfile/schemas/emergency-contacts";

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export type PersonalInfoVariables = z.infer<typeof personalInfo>;
export type MedicalInfoVariables = z.infer<typeof medicalInfo>;
export type EmergencyContactsVariables = z.infer<typeof emergencyContacts>;
