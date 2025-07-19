"use server";

import { db } from "@/shared/lib/drizzle/server";
import { eq, and } from "drizzle-orm";

import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";

import {
  updateNotificationSchema,
  UpdateNotificationVariables,
} from "@/features/notifications/schemas/update-notification";
import { headers } from "next/headers";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND_OR_NOT_UPDATED"
  | "UPDATE_ERROR";

export async function updateNotificationStatus(
  variables: UpdateNotificationVariables,
): Promise<ActionResponse<{ id: string; read: boolean }, ErrorCode>> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };
  }

  const parsed = updateNotificationSchema.safeParse({
    id: variables.id,
    read: variables.read,
  });

  if (!parsed.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsed.error.message },
    };
  }

  const { id, read } = variables;
  const userId = session.user.id;

  try {
    const result = await db
      .update(notification)
      .set({ read })
      .where(and(eq(notification.id, id), eq(notification.userId, userId)))
      .returning();

    if (!result[0]) {
      return {
        data: null,
        error: {
          code: "NOT_FOUND_OR_NOT_UPDATED",
          message: "Notification not found or not updated",
        },
      };
    }

    return { data: { id, read }, error: null };
  } catch (error) {
    return {
      data: null,
      error: { code: "UPDATE_ERROR", message: (error as Error).message },
    };
  }
}
