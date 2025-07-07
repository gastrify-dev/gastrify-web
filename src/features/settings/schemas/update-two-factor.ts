import { z } from "zod/v4";

export const updateTwoFactorSchema = z.object({
  enable2FA: z.boolean(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(50, {
      message: "Password must be at most 50 characters",
    }),
});
