"use server";

import { db } from "@/shared/lib/drizzle/server";
import { notification } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { notificationCreateSchema } from "../schemas/notification";
import { Notification } from "../types/notification";

export async function createNotification(
  data: unknown,
): Promise<ActionResponse<Notification, string>> {
  try {
    const parsed = notificationCreateSchema.safeParse(data);
    if (!parsed.success) {
      return {
        data: null,
        error: { code: "VALIDATION_ERROR", message: parsed.error.message },
      };
    }
    const result = await db
      .insert(notification)
      .values({
        id: crypto.randomUUID(),
        userId: parsed.data.userId,
        title: parsed.data.title,
        preview: parsed.data.preview,
        content: parsed.data.content,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    if (!result[0]) {
      return {
        data: null,
        error: {
          code: "CREATE_FAILED",
          message: "Failed to create notification",
        },
      };
    }
    const notif: Notification = {
      ...result[0],
      createdAt: new Date(result[0].createdAt).toISOString(),
      updatedAt: new Date(result[0].updatedAt).toISOString(),
      deletedAt: result[0].deletedAt
        ? new Date(result[0].deletedAt).toISOString()
        : null,
    };
    return { data: notif, error: null };
  } catch (error) {
    return {
      data: null,
      error: { code: "UNKNOWN_ERROR", message: (error as Error).message },
    };
  }
}
