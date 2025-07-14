import { db } from "@/shared/lib/drizzle/server";
import { notification } from "@/shared/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function deleteNotification({
  notificationId,
  userId,
}: {
  notificationId: string;
  userId: string;
}) {
  await db
    .update(notification)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(notification.id, notificationId), eq(notification.userId, userId)),
    );
}
