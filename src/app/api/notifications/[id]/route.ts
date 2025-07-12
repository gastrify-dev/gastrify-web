import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/lib/drizzle";
import {
  notification,
  notificationTranslation,
} from "@/shared/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/shared/lib/better-auth/server";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const params = await context.params;
  const notificationId = params.id;
  const body = await req.json();
  const [notif] = await db
    .select()
    .from(notification)
    .where(
      and(eq(notification.id, notificationId), eq(notification.userId, userId)),
    );
  if (!notif) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 },
    );
  }
  if (typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await db
    .update(notification)
    .set({ read: body.read })
    .where(eq(notification.id, notificationId));
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const notificationId = (await context.params).id;

  const [notif] = await db
    .select()
    .from(notification)
    .where(
      and(eq(notification.id, notificationId), eq(notification.userId, userId)),
    );

  if (!notif) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 },
    );
  }

  await db
    .update(notification)
    .set({ deletedAt: new Date() })
    .where(eq(notification.id, notificationId));

  await db
    .update(notificationTranslation)
    .set({ deletedAt: new Date() })
    .where(eq(notificationTranslation.id, notificationId));

  return NextResponse.json({ success: true });
}
