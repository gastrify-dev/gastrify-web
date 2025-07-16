"use server";

import { db } from "@/shared/lib/drizzle/server";
import { eq, and } from "drizzle-orm";

import { ActionResponse } from "@/shared/types";

import { notification } from "@/shared/lib/drizzle/schema";

export async function updateNotificationStatus(
  notificationId: string,
  userId: string,
  read: boolean,
): Promise<ActionResponse<{ id: string; read: boolean }, string>> {
  try {
    const result = await db
      .update(notification)
      .set({ read })
      .where(
        and(
          eq(notification.id, notificationId),
          eq(notification.userId, userId),
        ),
      )
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
    return { data: { id: notificationId, read }, error: null };
  } catch (error) {
    return {
      data: null,
      error: { code: "UPDATE_ERROR", message: (error as Error).message },
    };
  }
}
