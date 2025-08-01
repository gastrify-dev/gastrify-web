import { z } from "zod";

export const banUserSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required",
  }),
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(),
});
