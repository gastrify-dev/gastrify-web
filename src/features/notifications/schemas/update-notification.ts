import { z } from "zod";

export const updateNotificationSchema = z.object({
  id: z.string().min(1),
  read: z.boolean(),
});
export type UpdateNotificationVariables = z.infer<
  typeof updateNotificationSchema
>;
