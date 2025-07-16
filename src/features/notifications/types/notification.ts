import { z } from "zod";

import { notificationSchema } from "../schemas/notification";

export type Notification = z.infer<typeof notificationSchema>;

export type NotificationErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";
