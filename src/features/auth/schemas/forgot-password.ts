import { z } from "zod/v4";

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Email must be a valid email address",
  }),
});
