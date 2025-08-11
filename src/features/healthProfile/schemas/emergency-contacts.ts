import { z } from "zod/v4";

export const emergencyContacts = z.object({
  patientId: z.string(),
  contacts: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(1, {
        error: "Name is required",
      }),
      relationship: z.enum(["parent", "sibling", "spouse", "friend", "other"], {
        error: "Relationship is required",
      }),
      homePhoneNumber: z
        .string()
        .trim()
        .length(10, {
          error: "Home phone number must be 10 characters long",
        })
        .regex(/(^\d+$)|(^$)/, {
          error: "Home phone number must contain only numbers",
        }),
      mobilePhoneNumber: z
        .string()
        .trim()
        .length(10, {
          error: "Mobile phone number must be 10 characters long",
        })
        .regex(/^\d+$/, {
          error: "Mobile phone number must contain only numbers",
        }),
      workPhoneNumber: z
        .string()
        .trim()
        .length(10, {
          error: "Work phone number must be 10 characters long",
        })
        .regex(/(^\d+$)|(^$)/, {
          error: "Work phone number must contain only numbers",
        }),
      email: z.email({
        error: "Email must be a valid address",
      }),
    }),
  ),
});
