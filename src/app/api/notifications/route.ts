import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/lib/drizzle";
import {
  notification,
  notificationTranslation,
} from "@/shared/lib/drizzle/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { auth } from "@/shared/lib/better-auth/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const localeParam = req.nextUrl.searchParams.get("locale");
    const locale: "en" | "es" =
      localeParam === "en" || localeParam === "es" ? localeParam : "es";

    const rows = await db
      .select()
      .from(notification)
      .where(
        and(eq(notification.userId, userId), isNull(notification.deletedAt)),
      )
      .orderBy(desc(notification.createdAt));

    const notifications = await Promise.all(
      rows.map(async (n: typeof notification.$inferSelect) => {
        if (locale === "en") {
          const [translation] = await db
            .select()
            .from(notificationTranslation)
            .where(eq(notificationTranslation.id, n.id));
          return {
            ...n,
            title: translation?.titleEn ?? n.titleEs,
            preview: translation?.previewEn ?? n.previewEs,
            content: translation?.contentEn ?? n.contentEs,
          };
        } else {
          return {
            ...n,
            title: n.titleEs,
            preview: n.previewEs,
            content: n.contentEs,
          };
        }
      }),
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("API /notifications error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
