import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(50, {
      message: "Password must be at most 50 characters long",
    }),
});
