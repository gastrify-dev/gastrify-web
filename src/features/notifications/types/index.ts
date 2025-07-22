import { z } from "zod";

import { createNotificationSchema } from "@/features/notifications/schemas/create-notification";
import { getNotificationsSchema } from "@/features/notifications/schemas/get-notifications";
import { updateNotificationSchema } from "@/features/notifications/schemas/update-notification";
import { deleteNotificationSchema } from "@/features/notifications/schemas/delete-notification";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  preview: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateNotificationVariables = z.infer<
  typeof createNotificationSchema
>;

export type GetNotificationsVariables = z.infer<typeof getNotificationsSchema>;

export type UpdateNotificationVariables = z.infer<
  typeof updateNotificationSchema
>;

export type DeleteNotificationVariables = z.infer<
  typeof deleteNotificationSchema
>;
