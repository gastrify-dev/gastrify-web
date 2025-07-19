// export const notificationCreateSchema = z.object({
//   userId: z.string(),
//   title: z.string().max(255),
//   preview: z.string().max(255),
//   content: z.string().max(2000),
// });
import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().max(255),
  preview: z.string().max(255),
  content: z.string().max(2000),
  read: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type Notification = z.infer<typeof notificationSchema>;
