import { z } from "zod/v4";

export const recoverySchema = z.object({
  code: z.string().trim().length(11),
});
