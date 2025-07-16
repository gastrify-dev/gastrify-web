import { z } from "zod";

export const getNotificationsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});
export type GetNotificationsVariables = z.infer<typeof getNotificationsSchema>;
