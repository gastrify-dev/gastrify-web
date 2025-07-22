"use server";

import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";

import { getNotificationsSchema } from "@/features/notifications/schemas/get-notifications";
import type {
  Notification,
  GetNotificationsVariables,
} from "@/features/notifications/types";

type ErrorCode = "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR";

export async function getNotifications(
  variables: GetNotificationsVariables,
): Promise<ActionResponse<Notification[], ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };

  const parsedVariables = getNotificationsSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsedVariables.error.message },
    };
  }

  const { limit, offset } = parsedVariables.data;

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

  return { data: data ?? [], error: null };
}
