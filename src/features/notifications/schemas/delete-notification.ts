import { z } from "zod";

export const deleteNotificationSchema = z.object({
  id: z.string().min(1),
});
export type DeleteNotificationVariables = z.infer<
  typeof deleteNotificationSchema
>;
