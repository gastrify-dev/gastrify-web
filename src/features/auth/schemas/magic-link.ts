import { z } from "zod/v4";

export const magicLinkSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
});
