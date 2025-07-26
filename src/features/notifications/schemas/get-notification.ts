import { z } from "zod";

export const getNotificationSchema = z.object({
  id: z.string().min(1, { message: "Notification ID is required" }),
});
