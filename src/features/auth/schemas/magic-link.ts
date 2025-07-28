import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
});
