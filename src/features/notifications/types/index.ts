import { z } from "zod";

import { notification } from "@/shared/lib/drizzle/schema";

import { createNotificationSchema } from "@/features/notifications/schemas/create-notification";
import { updateNotificationSchema } from "@/features/notifications/schemas/update-notification";
import { deleteNotificationSchema } from "@/features/notifications/schemas/delete-notification";
import { getNotificationSchema } from "@/features/notifications/schemas/get-notification";

export type Notification = typeof notification.$inferSelect;

export type CreateNotificationVariables = z.infer<
  typeof createNotificationSchema
>;

export type UpdateNotificationVariables = z.infer<
  typeof updateNotificationSchema
>;

export type DeleteNotificationVariables = z.infer<
  typeof deleteNotificationSchema
>;

export type GetNotificationVariables = z.infer<typeof getNotificationSchema>;
