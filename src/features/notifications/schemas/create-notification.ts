import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(255),
  preview: z.string().min(1).max(255),
  content: z.string().min(1).max(2000),
});
export type CreateNotificationVariables = z.infer<
  typeof createNotificationSchema
>;
