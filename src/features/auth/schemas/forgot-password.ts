import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Email must be a valid email address",
  }),
});
