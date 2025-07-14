import { db } from "@/shared/lib/drizzle/server";
import { notification } from "@/shared/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function markNotificationRead({
  notificationId,
  userId,
  read,
}: {
  notificationId: string;
  userId: string;
  read: boolean;
}) {
  await db
    .update(notification)
    .set({ read })
    .where(
      and(eq(notification.id, notificationId), eq(notification.userId, userId)),
    );
}
