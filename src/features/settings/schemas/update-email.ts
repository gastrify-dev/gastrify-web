import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.email({
    message: "Email must be a valid email address",
  }),
});
