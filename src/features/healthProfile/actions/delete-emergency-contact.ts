"use server";

import { headers } from "next/headers";

import { ActionResponse } from "@/shared/types";
import { emergencyContacts } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";
import { tryCatch } from "@/shared/utils/try-catch";
import { db } from "@/shared/lib/drizzle/server";
import { and, eq } from "drizzle-orm";
import { isAdmin } from "@/shared/utils/is-admin";

type ErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "FORBIDDEN"
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

  const where = isAdmin(session.user)
    ? eq(emergencyContacts.id, emergencyContactId)
    : and(
        eq(emergencyContacts.id, emergencyContactId),
        eq(emergencyContacts.patientId, session.user.id),
      );

  const { data, error } = await tryCatch(
    db.delete(emergencyContacts).where(where).returning({
      id: emergencyContacts.id,
    }),
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
        message: "Emergency contact not found",
      },
    };
  }

  return { data: null, error: null };
};
