"use server";

import { headers } from "next/headers";
import { db } from "@/shared/lib/drizzle/server";
import { eq, and } from "drizzle-orm";

import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { updateNotificationSchema } from "@/features/notifications/schemas/update-notification";
import type { UpdateNotificationVariables } from "@/features/notifications/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

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

  const parsedVariables = updateNotificationSchema.safeParse({
    id: variables.id,
    read: variables.read,
  });

  if (!parsedVariables.success) {
    return {
      data: null,
      error: { code: "BAD_REQUEST", message: parsedVariables.error.message },
    };
  }

  const { id, read } = variables;
  const userId = session.user.id;

  const { data: result, error } = await tryCatch(
    db
      .update(notification)
      .set({ read })
      .where(and(eq(notification.id, id), eq(notification.userId, userId)))
      .returning(),
  );

  if (error) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      },
    };
  }

  if (!result || !result[0]) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Notification not found or not updated",
      },
    };
  }

  return { data: { id, read }, error: null };
}
