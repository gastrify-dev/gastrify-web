"use server";

import { headers } from "next/headers";

import { ActionResponse } from "@/shared/types";
import { emergencyContacts } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";
import { tryCatch } from "@/shared/utils/try-catch";
import { db } from "@/shared/lib/drizzle/server";
import { eq } from "drizzle-orm";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

export const deleteEmergencyContact = async (
  emergencyContactId: string,
): Promise<ActionResponse<null, ErrorCode>> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "User not authenticated" },
    };
  }

  const { data, error } = await tryCatch(
    db
      .delete(emergencyContacts)
      .where(eq(emergencyContacts.id, emergencyContactId))
      .returning(),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete emergency contact",
      },
    };
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Emergency contact not found or not deleted",
      },
    };
  }

  return { data: null, error: null };
};
