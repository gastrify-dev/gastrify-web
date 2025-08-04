import { z } from "zod";

export const recoverySchema = z.object({
  code: z.string().trim().length(11),
});
