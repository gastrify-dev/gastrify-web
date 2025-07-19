"use server";

import { db } from "@/shared/lib/drizzle/server";
import { eq, and } from "drizzle-orm";

import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";

import {
  deleteNotificationSchema,
  DeleteNotificationVariables,
} from "@/features/notifications/schemas/delete-notification";
import { headers } from "next/headers";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND_OR_NOT_DELETED"
  | "INTERNAL_SERVER_ERROR";

export async function deleteNotification(
  variables: DeleteNotificationVariables,
): Promise<ActionResponse<{ id: string }, ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };
  }

  const parsed = deleteNotificationSchema.safeParse({ id: variables.id });

  if (!parsed.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsed.error.message },
    };
  }

  const { id } = variables;
  const userId = session.user.id;

  try {
    const result = await db
      .delete(notification)
      .where(and(eq(notification.id, id), eq(notification.userId, userId)))
      .returning();

    if (!result[0]) {
      return {
        data: null,
        error: {
          code: "NOT_FOUND_OR_NOT_DELETED",
          message: "Notification not found or not deleted",
        },
      };
    }

    return { data: { id }, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete notification",
      },
    };
  }
}
