import { z } from "zod/v4";

export const emergencyContacts = z.object({
  contacts: z.array(
    z.object({
      name: z.string().trim().min(1, {
        error: "Name is required",
      }),
      relationship: z.enum(["parent", "sibling", "spouse", "friend", "other"], {
        error: "Relationship is required",
      }),
      homePhoneNumber: z
        .string()
        .trim()
        .regex(/(^\d{9}$)|(^$)/, {
          error: "Home phone number must contain only numbers",
        })
        .optional(),
      celularPhoneNumber: z
        .string()
        .trim()
        .length(10, {
          error: "Celular phone number must be 10 characters long",
        })
        .regex(/^\d{10}$/, {
          error: "Celular phone number must contain only numbers",
        }),
      workPhoneNumber: z
        .string()
        .trim()
        .length(10, {
          error: "Work phone number must be 10 characters long",
        })
        .regex(/^\d{10}$/, {
          error: "Work phone number must contain only numbers",
        })
        .optional(),
      email: z.email({
        error: "Email must be a valid address",
      }),
    }),
  ),
});
