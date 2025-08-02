import { z } from "zod/v4";

export const medicalInfo = z
  .object({
    bloodType: z.enum(["O", "A", "AB", "B"], {
      message: "BloodType is required",
    }),
    rhFactor: z.enum(["+", "-"], {
      message: "rhFactor is required",
    }),
    hasAllergies: z.boolean(),
    allergyDetails: z.string().trim(),
    religion: z.enum(["evangelical christian", "catholic", "other"], {
      message: "Religion is required",
    }),
    allowsTransfusions: z.boolean(),
    alcohol: z.boolean(),
    drugs: z.boolean(),
    hasChronicIllness: z.boolean(),
    chronicIllnessDetails: z.string().trim(),
    hasHealthInsurance: z.boolean(),
    healthInsuranceProvider: z.string().trim(),
  })
  .refine((data) => (data.hasAllergies ? data.allergyDetails : true), {
    error: "You must specify the details of the allergies",
    path: ["allergyDetails"],
  })
  .refine(
    (data) => (data.hasChronicIllness ? data.chronicIllnessDetails : true),
    {
      error:
        "You must specify all the information regarding your chronic illness",
      path: ["chronicIllnessDetails"],
    },
  )
  .refine(
    (data) => (data.hasHealthInsurance ? data.healthInsuranceProvider : true),
    {
      error: "You must specify the name of the health insurance provider",
      path: ["healthInsuranceProvider"],
    },
  );
