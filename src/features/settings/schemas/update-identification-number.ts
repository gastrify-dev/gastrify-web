import { z } from "zod/v4";

export const updateIdentificationNumberSchema = z.object({
  identificationNumber: z
    .string()
    .trim()
    .length(10, {
      message: "Identification number must be 10 characters long",
    })
    .regex(/^[0-9]+$/, {
      message: "Identification number must contain only numbers",
    }),
});
