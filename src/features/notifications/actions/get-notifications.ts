import { db } from "@/shared/lib/drizzle/server";
import {
  notification,
  notificationTranslation,
} from "@/shared/lib/drizzle/schema";
import { eq, and, desc, isNull, inArray } from "drizzle-orm";

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
  const rows = await db
    .select()
    .from(notification)
    .where(and(eq(notification.userId, userId), isNull(notification.deletedAt)))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);

  if (locale === "en") {
    const notificationIds = rows.map((n) => n.id);
    const translations =
      notificationIds.length > 0
        ? await db
            .select()
            .from(notificationTranslation)
            .where(inArray(notificationTranslation.id, notificationIds))
        : [];
    const translationMap = new Map(translations.map((t) => [t.id, t]));
    return rows.map((n) => {
      const t = translationMap.get(n.id);
      return {
        ...n,
        title: t?.titleEn ?? n.titleEs ?? "",
        preview: t?.previewEn ?? n.previewEs ?? "",
        content: t?.contentEn ?? n.contentEs ?? "",
      };
    });
  } else {
    return rows.map((n) => {
      return {
        ...n,
        title: n.titleEs ?? "",
        preview: n.previewEs ?? "",
        content: n.contentEs ?? "",
      };
    });
  }
}
