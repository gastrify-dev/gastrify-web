import { db } from "@/shared/lib/drizzle";
import { notification } from "@/shared/lib/drizzle/schema";
import { eq, and, desc, isNull } from "drizzle-orm";

interface I18nField {
  en: string;
  es: string;
}

interface NotificationRow
  extends Omit<
    typeof notification.$inferSelect,
    "title" | "preview" | "content"
  > {
  title: I18nField;
  preview: I18nField;
  content: I18nField;
}

export async function getNotifications({
  userId,
  locale,
  limit = 20,
  offset = 0,
}: {
  userId: string;
  locale: "en" | "es";
  limit?: number;
  offset?: number;
}) {
  // Get notifications for user, not deleted, ordered by createdAt desc
  const rows = await db
    .select()
    .from(notification)
    .where(and(eq(notification.userId, userId), isNull(notification.deletedAt)))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map((n) => {
    const notif = n as unknown as NotificationRow;
    return {
      ...notif,
      title: notif.title?.[locale] ?? notif.title?.en,
      preview: notif.preview?.[locale] ?? notif.preview?.en,
      content: notif.content?.[locale] ?? notif.content?.en,
    };
  });
}
