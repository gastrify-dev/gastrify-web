import { db } from "@/shared/lib/drizzle";
import { notification } from "@/shared/lib/drizzle/schema";
import { eq, and, isNull, sql } from "drizzle-orm";

export async function getUnreadNotificationCount({
  userId,
}: {
  userId: string;
}) {
  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(notification)
    .where(
      and(
        eq(notification.userId, userId),
        eq(notification.read, false),
        isNull(notification.deletedAt),
      ),
    );
  return Number(count);
}
