import { z } from "zod/v4";
import { personalInfo } from "./personal-info";
import { medicalInfo } from "./medical-info";
import { emergencyContacts } from "./emergency-contacts";

export const healthProfile = z.object({
  ...personalInfo.shape,
  ...medicalInfo.shape,
  ...emergencyContacts.shape,
});
