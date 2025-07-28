import { z } from "zod";

import { isValidIdentificationNumber } from "@/shared/utils/is-valid-identification-number";

export const updateIdentificationNumberSchema = z.object({
  identificationNumber: z
    .string()
    .trim()
    .length(10, {
      message: "Identification number must be 10 characters long",
    })
    .regex(/^[0-9]+$/, {
      message: "Identification number must contain only numbers",
    })
    .refine(isValidIdentificationNumber, {
      message: "Identification number is invalid",
    }),
});
