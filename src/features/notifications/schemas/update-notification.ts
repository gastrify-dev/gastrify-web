import { z } from "zod";

export const updateNotificationSchema = z.object({
  id: z.string().min(1, { message: "Notification ID is required" }),
  read: z.boolean(),
});
