import { z } from "zod";

export const updateLanguageSchema = z.object({
  language: z
    .string()
    .trim()
    .min(2, {
      message: "Language must be at least 2 characters",
    })
    .max(3, {
      message: "Language must be at most 3 characters",
    }),
});
