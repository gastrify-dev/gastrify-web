import z from "zod/v4";

import { Step1Schema } from "../schemas/step-1";
import { Step2Schema } from "../schemas/step-2";

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export type Step1Variables = z.infer<typeof Step1Schema>;
export type Step2Variables = z.infer<typeof Step2Schema>;
