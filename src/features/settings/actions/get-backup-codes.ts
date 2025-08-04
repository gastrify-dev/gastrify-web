"use server";

import { auth } from "@/shared/lib/better-auth/server";
import { ActionResponse } from "@/shared/types";
import { headers } from "next/headers";

type ErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "INTERNAL_SERVER_ERROR";

export const getBackupCodes = async (
  userId: string,
): Promise<ActionResponse<string[], ErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get backup codes",
      },
    };
  }

  if (session.user.id !== userId) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You are not authorized to get backup codes",
      },
    };
  }

  const { backupCodes, status } = await auth.api.viewBackupCodes({
    body: {
      userId,
    },
  });

  if (!status) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get backup codes",
      },
    };
  }

  return {
    data: [backupCodes],
    error: null,
  };
};
