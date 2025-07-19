import { z } from "zod";

import { createNotificationSchema } from "@/features/notifications/schemas/create-notification";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  preview: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type CreateNotificationVariables = z.infer<
  typeof createNotificationSchema
>;
