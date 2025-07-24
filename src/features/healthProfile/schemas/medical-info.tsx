import z from "zod/v4";

export const medicalInfo = z.object({
  bloodType: z.enum(["O", "A", "AB", "B"], {
    message: "BloodType is required",
  }),
  rhFactor: z.enum(["+", "-"], {
    message: "rhFactor is required",
  }),
  allergies: z.enum(["yes", "no"]),
  allergyDetails: z.string().trim(),
  religion: z.enum(["cristiano evangelico", "catolico", "otros"], {
    message: "Religion is required",
  }),
  allowsTransfusions: z.enum(["yes", "no"]),
  alcohol: z.enum(["yes", "no"]),
  drugs: z.enum(["yes", "no"]),
  chronicIllnessMedication: z.string().trim().optional(),
  chronicIlnessDetails: z.string().trim().optional(),
  hasHealthInsurance: z.enum(["yes", "no"]),
  healthInsuranceProvider: z.string().trim().optional(),
});
