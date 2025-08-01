import { z } from "zod";

export const unbanUserSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required",
  }),
});
