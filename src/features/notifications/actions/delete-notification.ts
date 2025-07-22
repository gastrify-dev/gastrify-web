"use server";

import { headers } from "next/headers";
import { db } from "@/shared/lib/drizzle/server";
import { eq, and } from "drizzle-orm";

import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { deleteNotificationSchema } from "@/features/notifications/schemas/delete-notification";
import type { DeleteNotificationVariables } from "@/features/notifications/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

export async function deleteNotification(
  variables: DeleteNotificationVariables,
): Promise<ActionResponse<null, ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };
  }

  const parsedVariables = deleteNotificationSchema.safeParse({
    id: variables.id,
  });

  if (!parsedVariables.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsedVariables.error.message },
    };
  }

  const { id } = parsedVariables.data;
  const userId = session.user.id;

  const { data: result, error } = await tryCatch(
    db
      .delete(notification)
      .where(and(eq(notification.id, id), eq(notification.userId, userId)))
      .returning(),
  );

  if (error) {
    console.error(error);
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete notification",
      },
    };
  }

  if (!result || !result[0]) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Notification not found or not deleted",
      },
    };
  }

  return { data: null, error: null };
}
