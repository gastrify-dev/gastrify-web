"use server";

import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";

import { getNotificationsSchema } from "@/features/notifications/schemas/get-notifications";
import {
  Notification,
  NotificationErrorCode,
} from "@/features/notifications/types/notification";
import { GetNotificationsVariables } from "@/features/notifications/schemas/get-notifications";

export async function getNotifications(
  variables: GetNotificationsVariables,
): Promise<ActionResponse<Notification[], NotificationErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };

  const parsed = getNotificationsSchema.safeParse(variables);

  if (!parsed.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsed.error.message },
    };
  }

  const { limit, offset } = parsed.data;

  const { data, error } = await tryCatch(
    db
      .select()
      .from(notification)
      .where(eq(notification.userId, session.user.id))
      .orderBy(desc(notification.createdAt))
      .limit(limit)
      .offset(offset),
  );

  if (error) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notifications",
      },
    };
  }

  const notifications = (data ?? []).map((n) => ({
    ...n,
    createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : "",
    updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString() : "",
    deletedAt: n.deletedAt ? new Date(n.deletedAt).toISOString() : null,
  }));

  return { data: notifications, error: null };
}
