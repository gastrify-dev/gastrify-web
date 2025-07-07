import { z } from "zod/v4";

export const twoFactorSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
