import { z } from "zod/v4";

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
});
