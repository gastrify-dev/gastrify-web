"use server";

import { headers } from "next/headers";
import { generateId } from "better-auth";

import { auth } from "@/shared/lib/better-auth/server";
import { notification } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { createNotificationSchema } from "@/features/notifications/schemas/create-notification";
import type { CreateNotificationVariables } from "@/features/notifications/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export async function createNotification(
  variables: CreateNotificationVariables,
): Promise<ActionResponse<null, ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };

  const parsedVariables = createNotificationSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsedVariables.error.message },
    };
  }

  const { userId, title, preview, content } = parsedVariables.data;

  const notificationId = generateId();
  const now = new Date();

  const { error } = await tryCatch(
    db.insert(notification).values({
      id: notificationId,
      userId,
      title,
      preview,
      content,
      read: false,
      createdAt: now,
      updatedAt: now,
    }),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create notification",
      },
    };
  }

  return { data: null, error: null };
}
