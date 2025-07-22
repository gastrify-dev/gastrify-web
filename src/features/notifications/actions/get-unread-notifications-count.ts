"use server";

import { headers } from "next/headers";
import { eq, and, isNull } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse } from "@/shared/types";
import { notification } from "@/shared/lib/drizzle/schema";

type ErrorCode = "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR";

export async function getUnreadNotificationsCount(): Promise<
  ActionResponse<number, ErrorCode>
> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };

  const { data, error } = await tryCatch(
    db
      .select()
      .from(notification)
      .where(
        and(
          eq(notification.userId, session.user.id),
          eq(notification.read, false),
          isNull(notification.deletedAt),
        ),
      ),
  );

  if (error) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to count unread notifications",
      },
    };
  }

  return { data: data ? data.length : 0, error: null };
}
