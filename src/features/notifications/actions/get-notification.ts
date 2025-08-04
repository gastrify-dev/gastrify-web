"use server";

import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { notification } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { getNotificationSchema } from "@/features/notifications/schemas/get-notification";
import type {
  GetNotificationVariables,
  Notification,
} from "@/features/notifications/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND";

export async function getNotification(
  variables: GetNotificationVariables,
): Promise<ActionResponse<Notification, ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };

  const parsedVariables = getNotificationSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsedVariables.error.message },
    };
  }

  const { id } = parsedVariables.data;

  const { data, error } = await tryCatch(
    db
      .select()
      .from(notification)
      .where(eq(notification.id, id))
      .orderBy(desc(notification.createdAt)),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notifications",
      },
    };
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      error: { code: "NOT_FOUND", message: "Notification not found" },
    };
  }

  return { data: data[0], error: null };
}
