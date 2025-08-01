import { z } from "zod";

export const updateUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  email: z.email({
    message: "Email must be a valid email address",
  }),
  role: z.enum(["admin", "user"]),
});
