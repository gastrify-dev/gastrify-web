"use server";

import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { notification } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Notification } from "@/features/notifications/types";

type ErrorCode = "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR";

export async function getNotifications(): Promise<
  ActionResponse<Notification[], ErrorCode>
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
      .where(eq(notification.userId, session.user.id))
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

  return { data: data ?? [], error: null };
}
