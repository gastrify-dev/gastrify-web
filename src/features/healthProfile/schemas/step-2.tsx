import z from "zod/v4";

export const Step2Schema = z.object({
  bloodType: z.enum(["O", "A", "AB", "B"], {
    message: "BloodType is required",
  }),
  rhFactor: z.enum(["+", "-"], {
    message: "rhFactor is required",
  }),
  allergies: z.boolean(),
  allergyDetails: z.string().trim(),
  religion: z.enum(["CRISTIANO EVANGELICO", "CATOLICO", "OTROS"], {
    message: "Religion is required",
  }),
  allowsTransfusions: z.boolean(),
  alcohol: z.boolean(),
  drugs: z.boolean(),
  chronicIllnessMedication: z.string().trim().optional(),
  chronicIlnessDetails: z.string().trim().optional(),
  hasHealthInsurance: z.boolean(),
  healthInsuranceProvider: z.string().trim(),
});
